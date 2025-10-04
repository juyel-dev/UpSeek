// script.js - Core Structure
class SimulationEngine {
    constructor() {
        this.isRunning = true;
        this.speed = 1;
        this.fps = 60;
        this.lastUpdate = 0;
        this.entities = [];
        this.worldMap = new WorldMap();
        this.dataLogger = new DataLogger();
        this.init();
    }

    init() {
        // Start with 2 entities (1 male, 1 female)
        this.entities.push(new Entity(0, 'male', {x: 100, y: 100}));
        this.entities.push(new Entity(1, 'female', {x: 150, y: 150}));
        this.startLoop();
    }

    startLoop() {
        const loop = (timestamp) => {
            if (this.isRunning) {
                const deltaTime = timestamp - this.lastUpdate;
                
                if (deltaTime > 1000 / this.fps) {
                    this.update(deltaTime);
                    this.render();
                    this.lastUpdate = timestamp;
                }
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(deltaTime) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.isAlive) {
                entity.update(deltaTime, this.entities, this.worldMap);
            }
        });

        // Remove dead entities
        this.entities = this.entities.filter(entity => entity.isAlive);
        
        // Log data for graphs
        this.dataLogger.logData(this.entities);
    }

    render() {
        // Render world and entities
        this.worldMap.render();
        this.entities.forEach(entity => entity.render());
        
        // Update graphs
        this.dataLogger.updateGraphs();
    }
}

class Entity {
    constructor(id, gender, position) {
        this.id = id;
        this.gender = gender;
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.genes = {
            speed: Math.random() * 2 + 1,
            fertility: Math.random() * 0.5 + 0.5,
            lifespan: Math.random() * 100 + 50,
            color: gender === 'male' ? '#4a8cff' : '#ff69b4'
        };
        this.age = 0;
        this.generation = 1;
        this.isAlive = true;
        this.partnerId = null;
        this.lastReproduction = 0;
    }

    update(deltaTime, allEntities, worldMap) {
        this.age += deltaTime / 1000;
        
        // Death by age
        if (this.age > this.genes.lifespan) {
            this.isAlive = false;
            return;
        }

        this.move(allEntities, worldMap);
        this.checkReproduction(allEntities);
    }

    move(allEntities, worldMap) {
        // Simple wandering behavior with Perlin-like noise
        this.velocity.x = (Math.random() - 0.5) * this.genes.speed;
        this.velocity.y = (Math.random() - 0.5) * this.genes.speed;
        
        // Apply velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Boundary checking
        this.position.x = Math.max(0, Math.min(800, this.position.x));
        this.position.y = Math.max(0, Math.min(600, this.position.y));
    }

    checkReproduction(allEntities) {
        const currentTime = Date.now();
        if (currentTime - this.lastReproduction < 15000) return; // 15s cooldown

        const oppositeGender = this.gender === 'male' ? 'female' : 'male';
        
        for (let entity of allEntities) {
            if (entity.gender === oppositeGender && 
                entity.isAlive &&
                this.getDistance(entity) < 30) {
                
                this.reproduceWith(entity, allEntities);
                this.lastReproduction = currentTime;
                entity.lastReproduction = currentTime;
                break;
            }
        }
    }

    getDistance(otherEntity) {
        return Math.sqrt(
            Math.pow(this.position.x - otherEntity.position.x, 2) +
            Math.pow(this.position.y - otherEntity.position.y, 2)
        );
    }

    reproduceWith(partner, allEntities) {
        const geneticSystem = new GeneticSystem();
        const childGenes = geneticSystem.combineGenes(this.genes, partner.genes);
        
        const child = new Entity(
            allEntities.length,
            Math.random() > 0.5 ? 'male' : 'female',
            {
                x: (this.position.x + partner.position.x) / 2,
                y: (this.position.y + partner.position.y) / 2
            }
        );
        
        child.genes = childGenes;
        child.generation = Math.max(this.generation, partner.generation) + 1;
        
        allEntities.push(child);
    }

    render() {
        const ctx = document.getElementById('worldCanvas').getContext('2d');
        ctx.fillStyle = this.genes.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

class WorldMap {
    constructor() {
        this.zones = this.generateZones();
        this.canvas = document.getElementById('worldCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    generateZones() {
        // Simple zone generation - replace with Perlin noise later
        const zones = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 6; y++) {
                const types = ['fertile', 'barren', 'water', 'volcanic'];
                zones.push({
                    x: x * 100, y: y * 100, width: 100, height: 100,
                    type: types[Math.floor(Math.random() * types.length)]
                });
            }
        }
        return zones;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.zones.forEach(zone => {
            const colors = {
                fertile: 'rgba(0, 255, 0, 0.2)',
                barren: 'rgba(139, 69, 19, 0.2)',
                water: 'rgba(0, 0, 255, 0.2)',
                volcanic: 'rgba(255, 0, 0, 0.2)'
            };
            
            this.ctx.fillStyle = colors[zone.type];
            this.ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        });
    }
}

class GeneticSystem {
    combineGenes(parent1, parent2) {
        const childGenes = {};
        
        for (let gene in parent1) {
            if (gene === 'color') {
                // Mix colors for visual evolution
                childGenes[gene] = this.mixColors(parent1[gene], parent2[gene]);
            } else {
                // Average with 5% mutation chance
                let value = (parent1[gene] + parent2[gene]) / 2;
                if (Math.random() < 0.05) { // 5% mutation
                    value *= (Math.random() * 0.4 + 0.8); // ±20% change
                }
                childGenes[gene] = value;
            }
        }
        
        return childGenes;
    }

    mixColors(color1, color2) {
        // Simple color mixing - can be enhanced
        return color1; // Placeholder
    }
}

class DataLogger {
    constructor() {
        this.data = {
            population: [],
            generations: [],
            mutations: [],
            timestamps: []
        };
        this.initCharts();
    }

    initCharts() {
        this.charts = {
            population: this.createChart('populationChart', 'Population vs Time', 'red'),
            generations: this.createChart('generationChart', 'Generation vs Time', 'green'),
            mutations: this.createChart('mutationChart', 'Mutation Rate', 'blue')
        };
    }

    createChart(canvasId, label, color) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: color,
                    backgroundColor: color + '20',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    logData(entities) {
        const timestamp = Date.now();
        
        this.data.population.push(entities.length);
        this.data.generations.push(this.calculateAvgGeneration(entities));
        this.data.mutations.push(this.countMutations(entities));
        this.data.timestamps.push(timestamp);

        // Keep only last 1000 data points
        if (this.data.population.length > 1000) {
            this.data.population.shift();
            this.data.generations.shift();
            this.data.mutations.shift();
            this.data.timestamps.shift();
        }
    }

    calculateAvgGeneration(entities) {
        if (entities.length === 0) return 0;
        return entities.reduce((sum, e) => sum + e.generation, 0) / entities.length;
    }

    countMutations(entities) {
        // Simplified mutation counting
        return entities.filter(e => e.generation > 1).length;
    }

    updateGraphs() {
        const timeLabels = this.data.timestamps.map(ts => 
            new Date(ts).toLocaleTimeString()
        );

        this.charts.population.data.labels = timeLabels;
        this.charts.population.data.datasets[0].data = this.data.population;
        this.charts.population.update();

        this.charts.generations.data.labels = timeLabels;
        this.charts.generations.data.datasets[0].data = this.data.generations;
        this.charts.generations.update();

        this.charts.mutations.data.labels = timeLabels;
        this.charts.mutations.data.datasets[0].data = this.data.mutations;
        this.charts.mutations.update();
    }
}

// Initialize simulation when page loads
let simulation;

document.addEventListener('DOMContentLoaded', () => {
    simulation = new SimulationEngine();
    
    // Event listeners for UI controls
    document.getElementById('pauseBtn').addEventListener('click', () => {
        simulation.isRunning = !simulation.isRunning;
    });
    
    document.getElementById('speedSlider').addEventListener('input', (e) => {
        simulation.speed = parseInt(e.target.value);
    });
});

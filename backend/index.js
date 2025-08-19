const http = require('http');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const workouts = [];

// Event: new workout added
myEmitter.on('workoutAdded', (workout) => {
    workouts.push(workout);
    console.log(`🏋️‍♂️ New workout added: ${workout.name}, Duration: ${workout.duration} min`);
});

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/add-workout') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const workout = JSON.parse(body);
            myEmitter.emit('workoutAdded', workout); // trigger event
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: 'Workout added!' }));
        });
    } else if (req.method === 'GET' && req.url === '/workouts') {

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(workouts));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});


server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

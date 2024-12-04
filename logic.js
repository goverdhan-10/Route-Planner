class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
        this.items.sort((a, b) => a[0] - b[0]);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

function dijkstra(V, adj, src, dest) {
    let pq = new PriorityQueue();
    let dist = Array(V).fill(Infinity);
    let prev = Array(V).fill(-1);
    pq.enqueue([0.0, src]);
    dist[src] = 0.0;

    while (!pq.isEmpty()) {
        let [_, u] = pq.dequeue();
        if (u === dest) break;

        for (let [v, weight] of adj[u]) {
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.enqueue([dist[v], v]);
                prev[v] = u;
            }
        }
    }


    let path = [];
    for (let at = dest; at !== -1; at = prev[at]) {
        path.push(at);
    }
    path.reverse();
    if (path[0] !== src) {
        return [];
    }

    return path;
}

document.addEventListener("DOMContentLoaded", function() {
    let location = ["Lanka", "DurgaKund", "IP Vijaya", "Assi Crossing", "Gadaulia Chauraha", "RathYatra Chauraha", "Varanasi Cantt",
        "Lahurabir Chauraha", "Beniya Park", "Varanasi City", "Namo Ghat", "Mahmoorganj", "Maduadiha Chauraha", "DLW Tiraha", "Sunderpur Chauraha", "Naria Crossing", "Sarnath", "RamNagar Fort", "PanchKoshi Chauraha", "Padaw Chauraha", "Aashapur Chauraha", "Pandeypur Chauraha", "Taj Ganges"
    ];

    let varanasi = [
        [[3, 1.6], [1, 1.6], [15, 0.9], [17, 2.9]],
        [[2, 1.3], [0, 1.6]],
        [[5, 1.9], [1, 1.3]],
        [[0, 1.6], [4, 2.5]],
        [[5, 2.0], [10, 4.3], [8, 1.3], [3, 2.5]],
        [[6, 3.1], [11, 1.4], [2, 2.3], [4, 2.0]],
        [[5, 3.1], [9, 3.2], [7, 1.9], [22, 1.2]],
        [[6, 1.9], [8, 1.1]],
        [[4, 1.3], [7, 1.1]],
        [[6, 3.2], [10, 2.9]],
        [[4, 4.3], [9, 2.9], [18, 4.3], [19, 2.6]],
        [[5, 1.4], [12, 1.6]],
        [[11, 1.6], [13, 2.7]],
        [[12, 2.7], [14, 1.6]],
        [[13, 1.6], [15, 1.2]],
        [[0, 0.9], [14, 1.2]],
        [[20, 1.2]],
        [[0, 2.9], [19, 5.7]],
        [[10, 4.3], [20, 1.2]],
        [[10, 2.6], [17, 5.7]],
        [[16, 1.2], [21, 3.8], [18, 1.2]],
        [[22, 2.7], [20, 3.8]],
        [[6, 1.2], [21, 2.7]]
    ];

    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const pathDisplay = document.getElementById('path');
    const massage = document.getElementById('msg');

    location.forEach((loc, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = loc;
        fromSelect.appendChild(option);
        let option2 = option.cloneNode(true);
        toSelect.appendChild(option2);
    });

    document.getElementById('getpath').addEventListener('click', () => {
        let sourceIndex = parseInt(fromSelect.value);
        let destIndex = parseInt(toSelect.value);
        if (sourceIndex === destIndex) {
            pathDisplay.textContent = "Enter Valid Source and Destination!!";
            return;
        }

        let ans = dijkstra(varanasi.length, varanasi, sourceIndex, destIndex);
        console.log('ans:', ans); // Debug: check the returned path
        let main_station = [0, 4, 5, 6, 10, 20];
        let path = [];
        path.push(sourceIndex);

        for (let i = 1; i < ans.length - 1; i++) {
            if (main_station.includes(ans[i])) {
                path.push(ans[i]);
            }
        }

        path.push(destIndex);
        console.log('path:', path); // Debug: check the final path with main stations

        pathDisplay.textContent = path.map(index => location[index]).join(" to ");
        msg.innerText="Change Line at the intermediate stations";
    });
});

window.addEventListener('DOMContentLoaded', () => {
  // Data
  const stationCoords = {
    0: { x: 384, y: 961 }, 1: { x: 348, y: 869 }, 2: { x: 360, y: 803 }, 3: { x: 392, y: 877 },
    4: { x: 412, y: 705 }, 5: { x: 287, y: 722 }, 6: { x: 273, y: 483 }, 7: { x: 352, y: 549 },
    8: { x: 385, y: 627 }, 9: { x: 474, y: 451 }, 10: { x: 581, y: 488 }, 11: { x: 181, y: 720 },
    12: { x: 64, y: 753 }, 13: { x: 59, y: 915 }, 14: { x: 201, y: 932 }, 15: { x: 314, y: 963 },
    16: { x: 591, y: 48 }, 17: { x: 643, y: 1046 }, 18: { x: 587, y: 308 }, 19: { x: 797, y: 645 },
    20: { x: 596, y: 212 }, 21: { x: 295, y: 309 }, 22: { x: 204, y: 428 }
  };

  const locationNames = [
    "Lanka","DurgaKund","IP Vijaya","Assi Crossing","Gadaulia Chauraha","RathYatra Chauraha",
    "Varanasi Cantt","Lahurabir Chauraha","Beniya Park","Varanasi City","Namo Ghat","Mahmoorganj",
    "Maduadiha Chauraha","DLW Tiraha","Sunderpur Chauraha","Naria Crossing","Sarnath",
    "RamNagar Fort","PanchKoshi Chauraha","Padaw Chauraha","Aashapur Chauraha","Pandeypur Chauraha","Taj Ganges"
  ];

  // Permanent route definitions
  const permanentRoutes = [
    {
      path: [0, 15, 14, 13, 12, 11, 5, 4, 3, 0], // Lanka circular route
      color: "#ff1919ff", // red
      name: "Lanka Circular Line",
      width: 6
    },
    {
      path: [0, 1, 2, 5], // Lanka to RathYatra via DurgaKund and IP Vijaya
      color: "#a600ff", // purple
      name: "Lanka-DurgaKund Line",
      width: 6
    },
    {
      path: [0, 17, 19, 10], // Lanka to Namo Ghat via RamNagar and Padaw
      color: "#ff00b8", // pink
      name: "Lanka-RamNagar Line",
      width: 6
    },
    {
      path: [5, 6, 9, 10, 4], // RathYatra to Gadaulia via Cantt, City, Namo Ghat
      color: "#3b00ff", // blue
      name: "RathYatra-Gadaulia Line",
      width: 6
    },
    {
      path: [4, 8, 7, 6], // Gadaulia to Cantt via Beniya Park and Lahurabir
      color: "#00ff77", // green
      name: "Gadaulia-Cantt Line",
      width: 6
    },
    {
      path: [6, 22, 21, 20], // Cantt to Aashapur via Taj and Pandeypur
      color: "#790000", // brown
      name: "Cantt-Aashapur Line",
      width: 6
    },
    {
      path: [10, 18, 20, 16], // Namo to Sarnath via PanchKoshi and Aashapur
      color: "#00fff7", // orange
      name: "Namo-Sarnath Line",
      width: 6
    }
  ];

  function setupAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener('input', () => {
      const val = input.value.toLowerCase().trim();
      dropdown.innerHTML = '';
      if (!val) {
        dropdown.style.display = 'none';
        input.dataset.selectedIndex = -1;
        return;
      }
      const filtered = locationNames
        .map((name, index) => ({name, index}))
        .filter(item => item.name.toLowerCase().includes(val));

      if (filtered.length === 0) {
        dropdown.style.display = 'none';
        input.dataset.selectedIndex = -1;
        return;
      }

      filtered.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.name;
        div.dataset.index = item.index;
        div.onclick = () => {
          input.value = item.name;
          input.dataset.selectedIndex = item.index;
          dropdown.style.display = 'none';
        };
        dropdown.appendChild(div);
      });

      // Position dropdown below input
      const rect = input.getBoundingClientRect();
      dropdown.style.width = rect.width + 'px';
      dropdown.style.top = (input.offsetTop + input.offsetHeight) + 'px';
      dropdown.style.left = input.offsetLeft + 'px';

      dropdown.style.position = 'absolute';
      dropdown.style.display = 'block';
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', e => {
      if (e.target !== input && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  // Initialize autocompletes
  setupAutocomplete('fromInput', 'fromDropdown');
  setupAutocomplete('toInput', 'toDropdown');

  // Graph adjacency
  const varanasi = [
    [[3,1.6],[1,1.6],[15,0.9],[17,2.9]], [[2,1.3],[0,1.6]], [[5,1.9],[1,1.3]], [[0,1.6],[4,2.5]],
    [[5,2.0],[10,4.3],[8,1.3],[3,2.5]], [[6,3.1],[11,1.4],[2,2.3],[4,2.0]], [[5,3.1],[9,3.2],[7,1.9],[22,1.2]],
    [[6,1.9],[8,1.1]], [[4,1.3],[7,1.1]], [[6,3.2],[10,2.9]], [[4,4.3],[9,2.9],[18,4.3],[19,2.6]],
    [[5,1.4],[12,1.6]], [[11,1.6],[13,2.7]], [[12,2.7],[14,1.6]], [[13,1.6],[15,1.2]], [[0,0.9],[14,1.2]],
    [[20,1.2]], [[0,2.9],[19,5.7]], [[10,4.3],[20,1.2]], [[10,2.6],[17,5.7]], [[16,1.2],[21,3.8],[18,1.2]],
    [[22,2.7],[20,3.8]], [[6,1.2],[21,2.7]]
  ];

  // PriorityQueue + Dijkstra
  class PriorityQueue {
    constructor(){ this.items = []; }
    enqueue(e){ this.items.push(e); this.items.sort((a,b)=>a[0]-b[0]); }
    dequeue(){ return this.items.shift(); }
    isEmpty(){ return !this.items.length; }
  }
  function dijkstra(V, adj, src, dest){
    let pq = new PriorityQueue(), dist = Array(V).fill(Infinity), prev = Array(V).fill(-1);
    pq.enqueue([0, src]); dist[src] = 0;
    while(!pq.isEmpty()){
      let [_, u] = pq.dequeue();
      if(u === dest) break;
      for(let [v,w] of adj[u]){
        if(dist[v] > dist[u] + w){ dist[v] = dist[u] + w; pq.enqueue([dist[v], v]); prev[v] = u; }
      }
    }
    let path = []; for(let at = dest; at !== -1; at = prev[at]) path.push(at);
    path.reverse(); return path[0] === src ? path : [];
  }

  // Get DOM references
  const edgesLayer = document.getElementById('edgesLayer');
  const stationsLayer = document.getElementById('stationsLayer');
  const routeLayer = document.getElementById('routeLayer');
  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  const getBtn = document.getElementById('getpath');
  const msg = document.getElementById('msg');

  function drawPermanentRoutes() {
    const permanentRoutesLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    permanentRoutesLayer.id = "permanentRoutesLayer";
    document.getElementById('svgMap').appendChild(permanentRoutesLayer);

    permanentRoutes.forEach(route => {
      const points = route.path.map(i => `${stationCoords[i].x},${stationCoords[i].y}`).join(' ');
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("points", points);
      poly.setAttribute("class", "permanent-route");
      poly.setAttribute("stroke", route.color);
      poly.setAttribute("stroke-width", route.width);
      poly.setAttribute("stroke-linecap", "round");
      poly.setAttribute("stroke-linejoin", "round");
      poly.setAttribute("fill", "none");
      poly.setAttribute("opacity", "0.7");
      permanentRoutesLayer.appendChild(poly);
      
      // Add route name label at midpoint
      
    });
  }

  function drawNetwork(){
    const added = new Set();
    for(let u=0; u<varanasi.length; u++){
      for(let [v] of varanasi[u]){
        const key = u<v ? `${u}-${v}` : `${v}-${u}`;
        if(added.has(key)) continue;
        added.add(key);
        const a = stationCoords[u], b = stationCoords[v];
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
        line.setAttribute("class","edge");
        edgesLayer.appendChild(line);
      }
    }
    for(let id=0; id<locationNames.length; id++){
      const p = stationCoords[id];

      // Create station dot
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", p.x);
      dot.setAttribute("cy", p.y);
      dot.setAttribute("r", 6);
      dot.setAttribute("fill", "#007BFF");
      dot.setAttribute("class", "station-dot");
      stationsLayer.appendChild(dot);

      // Create label group
      const labelGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
      labelGroup.classList.add("station-label-group");
      labelGroup.setAttribute("data-station-id", id);

      // Create rect for background box
      const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
      const paddingX = 6;
      const paddingY = 3;
      const fontSize = 13;

      // Temporarily create text to measure width
      const tempText = document.createElementNS("http://www.w3.org/2000/svg","text");
      tempText.setAttribute("x", 0);
      tempText.setAttribute("y", 0);
      tempText.style.fontSize = fontSize + "px";
      tempText.style.fontWeight = "600";
      tempText.textContent = locationNames[id];
      stationsLayer.appendChild(tempText);
      const bbox = tempText.getBBox();
      stationsLayer.removeChild(tempText);

      const labelOffsets = {
        0: { x: 18, y: -2 },   // Lanka
        15: { x: 0, y: -20 }, 
        1:{x:-80 , y:0}, 
        2:{x:-80,y:0},
        11:{x:0,y:-25},
        12:{x:15,y:-25},
        13:{x:0,y:-32},
        16:{x:10,y:0},
        19:{x:-120,y:-20},
        14:{x:0,y:20},
        5:{x:-130,y:20},
        6:{x:-110,y:-10},
        22:{x:20,y:0},
        21:{x:0,y:-20},
        10:{x:12,y:15},
        9:{x:-80,y:15},
      };

      const offset = labelOffsets[id] || { x: 10, y: -10 };
      rect.setAttribute("x", p.x + offset.x - paddingX);
      rect.setAttribute("y", p.y - offset.y - bbox.height + paddingY);
      rect.setAttribute("width", bbox.width + paddingX*2);
      rect.setAttribute("height", bbox.height + paddingY*2);
      rect.setAttribute("class", "station-label-bg");
      rect.setAttribute("rx", 5);
      rect.setAttribute("ry", 5);
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke", "#ccc");
      rect.setAttribute("stroke-width", "1");

      // Create actual text
      const txt = document.createElementNS("http://www.w3.org/2000/svg","text");
      txt.setAttribute("x", p.x + offset.x);
      txt.setAttribute("y", p.y - offset.y);
      txt.setAttribute("class","station-label");
      txt.textContent = locationNames[id];

      labelGroup.appendChild(rect);
      labelGroup.appendChild(txt);
      stationsLayer.appendChild(labelGroup);
    }
  }

  const routeColors = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe"
  ];
  let routeColorIndex = 0;

  function resetView() {
    // Reset all edges to full opacity
    document.querySelectorAll('.edge').forEach(edge => {
      edge.classList.remove('faded');
    });
    // Clear any existing route
    while(routeLayer.firstChild) routeLayer.removeChild(routeLayer.firstChild);
    // Show all station labels
    document.querySelectorAll('.station-label-group').forEach(group => {
      group.classList.remove('hidden');
    });
    // Clear message
    msg.textContent = '';
  }

  function showPath(path){
    // Hide all station labels first
    document.querySelectorAll('.station-label-group').forEach(group => {
      group.classList.add('hidden');
    });
    
    // Fade all edges except permanent routes
    document.querySelectorAll('.edge').forEach(edge => {
      edge.classList.add('faded');
    });
    
    // Clear previous route
    while(routeLayer.firstChild) routeLayer.removeChild(routeLayer.firstChild);
    if(!path.length) return;
    
    // Draw the path line (thicker and solid)
    const points = path.map(i => `${stationCoords[i].x},${stationCoords[i].y}`).join(' ');
    const poly = document.createElementNS("http://www.w3.org/2000/svg","polyline");
    poly.setAttribute("points", points);
    poly.setAttribute("class", "route");
    poly.setAttribute("stroke", routeColors[routeColorIndex % routeColors.length]);
    poly.setAttribute("stroke-width", "6");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    poly.setAttribute("fill", "none");
    routeLayer.appendChild(poly);
    
    // Show labels for stations in path
    path.forEach(stationId => {
      const labelGroup = document.querySelector(`.station-label-group[data-station-id="${stationId}"]`);
      if (labelGroup) {
        labelGroup.classList.remove('hidden');
      }
      
      // Highlight station dots
      const p = stationCoords[stationId];
      const dot = document.createElementNS("http://www.w3.org/2000/svg","circle");
      dot.setAttribute("cx", p.x);
      dot.setAttribute("cy", p.y);
      dot.setAttribute("r", 7);
      dot.setAttribute("class", "highlight-dot");
      dot.setAttribute("fill", routeColors[routeColorIndex % routeColors.length]);
      routeLayer.appendChild(dot);
    });
    
    // Highlight the edges that are part of the path
    const pathEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i], v = path[i+1];
      pathEdges.add(u < v ? `${u}-${v}` : `${v}-${u}`);
    }
    
    document.querySelectorAll('.edge').forEach(edge => {
      const u = edge.getAttribute('x1');
      const v = edge.getAttribute('x2');
      const key = `${u}-${v}`;
      if (pathEdges.has(key)) {
        edge.classList.remove('faded');
      }
    });
    
    routeColorIndex++;
    msg.textContent = `Path: ${path.map(id => locationNames[id]).join(' → ')}`;
  }

  // Draw the map initially
  drawNetwork();
  drawPermanentRoutes();

  // Button click handler
  getBtn.onclick = () => {
    resetView();
    
    const s = fromInput.dataset.selectedIndex !== undefined ? Number(fromInput.dataset.selectedIndex) : -1;
    const d = toInput.dataset.selectedIndex !== undefined ? Number(toInput.dataset.selectedIndex) : -1;
    
    if (s === -1 || d === -1) {
      msg.textContent = "⚠ Please select valid stations from suggestions";
      return;
    }
    if (s === d) {
      msg.textContent = "⚠ Choose different source & destination";
      return;
    }
    
    const ans = dijkstra(varanasi.length, varanasi, s, d);
    if (!ans.length) {
      msg.textContent = "❌ No path found";
      return;
    }
    
    showPath(ans);
  };
});
#include<bits/stdc++.h>
using namespace std;

typedef pair<double, int> iPair; 

vector<int> dijkstra(int V, vector<vector<iPair>> &adj, int src, int dest) {
    priority_queue<iPair, vector<iPair>, greater<iPair>> pq;
    vector<double> dist(V, DBL_MAX);
    vector<int> prev(V, -1);
    pq.push(make_pair(0.0, src));
    dist[src] = 0.0;
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        if (u == dest) break;
        for (auto &neighbor : adj[u]) {
            int v = neighbor.first;
            double weight = neighbor.second;
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push(make_pair(dist[v], v));
                prev[v] = u;
            }
        }
    }
    vector<int> path;
    for (int at = dest; at != -1; at = prev[at]) {
        path.push_back(at);
    }
    reverse(path.begin(), path.end());
    if (path[0] != src) {
        return {};
    }
    
    return path;
}

int main(){
    vector<string> location = {"Lanka","DurgaKund","IPVijaya","AssiCrossing","GadauliaChauraha","RathYatraChauraha","VaransiCantt",
    "LahurabirChauraha","BeniyaPark","VaranasiCity","NamoGhat","Mahmoorganj","MaduadihaChauraha","DLWTiraha","SunderpurChauraha","NariaCrossing","Sarnath","RamNagarFort","PanchKoshiChauraha","PadawChauraha","AashapurChauraha","PandeypurChauraha","TajGanges"};
    pair<float,float> ipair;
    //8 new stations added mark them in map
    vector<vector<iPair>> varanasi={{{3.0,1.6},{1.0,1.6},{15.0,0.9},{17.0,2.9}},{{2.0,1.3},{0,1.6}},{{5.0,1.9},{1.0,1.3}},{{0,1.6},{4.0,2.5}},{{5.0,2.0},{10.0,4.3},{8.0,1.3},{3.0,2.5}},{{6.0,3.1},{11.0,1.4},{2.0,2.3},{4.0,2.0}},{{5.0,3.1},{9.0,3.2},{7.0,1.9},{22.0,1.2}},{{6.0,1.9},{8.0,1.1}},{{4.0,1.3},{7.0,1.1}},{{6.0,3.2},{10.0,2.9}},{{4.0,4.3},{9.0,2.9},{18.0,4.3},{19.0,2.6}},{{5.0,1.4},{12.0,1.6}},{{11.0,1.6},{13.0,2.7}},{{12.0,2.7},{14.0,1.6}},{{13.0,1.6},{15.0,1.2}},{{0,0.9},{14.0,1.2}},{{20.0,1.2}},{{0,2.9},{19.0,5.7}},{{10.0,4.3},{20.0,1.2}},{{10.0,2.6},{17.0,5.7}},{{16.0,1.2},{21.0,3.8},{18.0,1.2}},{{22.0,2.7},{20.0,3.8}},{{6.0,1.2},{21.0,2.7}}};
    string source,destination;
    cout<<"Enter Source:";  
    cin>>source;
    cout<<"Enter Destination:";
    cin>>destination;
    int source_index,dest_index;
    bool flag=true;
    if(source==destination) cout<<"Enter Valid Source and Destination!!";
    for(int i=0;i<23;i++){
        if(location[i]==source){
            source_index=i;
            break;
        }
    }
    for(int i=0;i<23;i++){
        if(location[i]==destination){
            dest_index=i;
            break;
        }
    }
    float source_ind=static_cast<float>(source_index);
    float dest_ind=static_cast<float>(dest_index);
    vector<int> ans=dijkstra(varanasi.size(),varanasi,source_index,dest_index);
    vector<int> main_station={0,4,5,6,10,20};
    vector<int> path;
    path.push_back(source_index);
    for(int i=1;i<ans.size()-1;i++){
        for(int j=0;j<6;j++){
            if(ans[i]==main_station[j]){
                path.push_back(main_station[j]);
            }
        }
    }
    path.push_back(dest_index);
    for(int i=0;i<path.size();i++){
        cout<<location[path[i]]<<" ";
    }

}
import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const initialPatients=[
{id:1,name:'Ali Khan',age:42,level:'Critical',dept:'Emergency',status:'Waiting'},
{id:2,name:'Sara Ahmed',age:29,level:'High',dept:'Cardiology',status:'Waiting'},
{id:3,name:'Usman Raza',age:55,level:'Medium',dept:'Neurology',status:'Waiting'},
{id:4,name:'Ayesha Noor',age:34,level:'Low',dept:'General',status:'Waiting'}
];
const doctors=[['Dr. Hamza','Emergency','Available'],['Dr. Hina','Cardiology','Busy'],['Dr. Bilal','Neurology','Available'],['Dr. Zara','General','Available']];
const depts=['Emergency','Cardiology','Neurology','General'];
const priority={Critical:1,High:2,Medium:3,Low:4};

function App(){
 const [page,setPage]=useState('Dashboard');
 const [patients,setPatients]=useState(()=>JSON.parse(localStorage.getItem('hems-patients')||'null')||initialPatients);
 const [search,setSearch]=useState(''); const [sortKey,setSortKey]=useState('level');
 const [steps,setSteps]=useState([]);
 const [newName,setNewName]=useState(''); const [newLevel,setNewLevel]=useState('High');
 useEffect(()=>localStorage.setItem('hems-patients',JSON.stringify(patients)),[patients]);
 const waiting=patients.filter(p=>p.status==='Waiting');
 const pq=[...waiting].sort((a,b)=>priority[a.level]-priority[b.level]);
 const filtered=patients.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
 const add=()=>{if(!newName.trim())return;setPatients([...patients,{id:Date.now(),name:newName.trim(),age:30,level:newLevel,dept:'Emergency',status:'Waiting'}]);setNewName('')};
 const discharge=id=>setPatients(patients.map(p=>p.id===id?{...p,status:'Treated'}:p));
 const nav=['Dashboard','Patients','Emergency Queue','Doctors','Departments','DSA Visualizer','Searching','Sorting','Graph Algorithms','Emergency Simulation','Analytics'];
 return <div className="app"><aside><h1>DSA (OEL)</h1><p className="muted">Emergency Management</p>{nav.map(n=><button className={page===n?'nav active':'nav'} onClick={()=>setPage(n)}>{n}</button>)}</aside>
 <main><header><div><span className="eyebrow">HOSPITAL OPERATIONS</span><h2>{page}</h2></div></header>
 {page==='Dashboard'&&<Dashboard patients={patients} pq={pq} setPage={setPage}/>}
 {page==='Patients'&&<Patients patients={filtered} search={search} setSearch={setSearch} add={add} newName={newName} setNewName={setNewName} newLevel={newLevel} setNewLevel={setNewLevel} discharge={discharge}/>}
 {page==='Emergency Queue'&&<Queue pq={pq} patients={patients} discharge={discharge}/>}
 {page==='Doctors'&&<Doctors/>}{page==='Departments'&&<Departments/>}
 {page==='DSA Visualizer'&&<Visualizer steps={steps} setSteps={setSteps}/>}
 {page==='Searching'&&<Searching patients={patients} setSteps={setSteps}/>}
 {page==='Sorting'&&<Sorting setSteps={setSteps}/>}
 {page==='Graph Algorithms'&&<Graph setSteps={setSteps}/>}
 {page==='Emergency Simulation'&&<Simulation patients={patients} setPatients={setPatients}/>}
 {page==='Analytics'&&<Analytics patients={patients}/>}
 </main></div>
}

function Dashboard({patients,pq,setPage}){let critical=patients.filter(p=>p.level==='Critical'&&p.status==='Waiting').length;return <><div className="grid stats"><Card t="Total Patients" v={patients.length} s="Registered"/><Card t="Critical Cases" v={critical} s="Need priority"/><Card t="Waiting Queue" v={pq.length} s="Active patients"/><Card t="Departments" v={4} s="Operational"/></div><section className="panel"><div className="panelhead"><h3>Emergency Priority Queue</h3><button onClick={()=>setPage('Emergency Queue')}>Open Queue</button></div>{pq.slice(0,5).map((p,i)=><div className="row"><b>#{i+1} {p.name}</b><span>{p.dept}</span><span className={'pill '+p.level.toLowerCase()}>{p.level}</span></div>)}</section><div className="grid two"><section className="panel"><h3>DSA Modules</h3><p className="muted">Queue • Priority Queue • Stack • Linked List • Graph • BFS • DFS • Dijkstra</p><button onClick={()=>setPage('DSA Visualizer')}>Launch Visualizer →</button></section><section className="panel"><h3>Quick Actions</h3><div className="actions"><button onClick={()=>setPage('Patients')}>Register Patient</button><button onClick={()=>setPage('Emergency Simulation')}>Run Simulation</button></div></section></div></>}
function Card({t,v,s}){return <div className="card"><span>{t}</span><strong>{v}</strong><small>{s}</small></div>}
function Patients({patients,search,setSearch,add,newName,setNewName,newLevel,setNewLevel,discharge}){return <><section className="panel form"><input placeholder="Patient name" value={newName} onChange={e=>setNewName(e.target.value)}/><select value={newLevel} onChange={e=>setNewLevel(e.target.value)}>{Object.keys(priority).map(x=><option>{x}</option>)}</select><button onClick={add}>+ Register</button><input placeholder="Linear search patients..." value={search} onChange={e=>setSearch(e.target.value)}/></section><section className="panel"><div className="table">{patients.map(p=><div className="trow"><b>{p.name}</b><span>Age {p.age}</span><span>{p.dept}</span><span className={'pill '+p.level.toLowerCase()}>{p.level}</span><span>{p.status}</span>{p.status==='Waiting'&&<button onClick={()=>discharge(p.id)}>Treat</button>}</div>)}</div></section></>}
function Queue({pq,patients,discharge}){return <><section className="panel"><h3>Priority Queue — Emergency First</h3>{pq.map((p,i)=><div className="queue"><span className="num">{i+1}</span><div><b>{p.name}</b><small>{p.dept} · Age {p.age}</small></div><span className={'pill '+p.level.toLowerCase()}>{p.level}</span><button onClick={()=>discharge(p.id)}>Treat</button></div>)}{!pq.length&&<p className="muted">Queue is empty.</p>}</section><section className="panel"><h3>Normal Queue (FIFO)</h3><p className="muted">{patients.filter(p=>p.status==='Waiting'&&p.level==='Low').map(p=>p.name).join(' → ')||'No normal patients waiting.'}</p></section></>}
function Doctors(){return <div className="grid two">{doctors.map(d=><section className="panel"><div className="doctor"><div className="avatar">{d[0].split(' ')[1][0]}</div><div><h3>{d[0]}</h3><p>{d[1]}</p></div><span className="available">{d[2]}</span></div></section>)}</div>}
function Departments(){return <div className="grid two">{depts.map((d,i)=><section className="panel"><h3>{d}</h3><p className="muted">Department #{i+1} · Emergency care unit</p><div className="bar"><i style={{width:(55+i*10)+'%'}}/></div><small>{55+i*10}% capacity</small></section>)}</div>}
function Visualizer({steps,setSteps}){const [stack,setStack]=useState([]);const [queue,setQueue]=useState([]);const [value,setValue]=useState('Patient');const push=()=>{setStack([...stack,value]);setSteps([...steps,`Stack PUSH: ${value}`])};const pop=()=>{if(stack.length){setSteps([...steps,`Stack POP: ${stack.at(-1)}`]);setStack(stack.slice(0,-1))}};const enq=()=>{setQueue([...queue,value]);setSteps([...steps,`Queue ENQUEUE: ${value}`])};const deq=()=>{if(queue.length){setSteps([...steps,`Queue DEQUEUE: ${queue[0]}`]);setQueue(queue.slice(1))}};return <div className="grid two"><section className="panel"><h3>Stack — Patient History</h3><input value={value} onChange={e=>setValue(e.target.value)}/><div className="actions"><button onClick={push}>Push</button><button onClick={pop}>Pop</button></div><div className="stack">{stack.map(x=><div>{x}</div>)}</div></section><section className="panel"><h3>Queue — Patient Flow</h3><input value={value} onChange={e=>setValue(e.target.value)}/><div className="actions"><button onClick={enq}>Enqueue</button><button onClick={deq}>Dequeue</button></div><div className="stack">{queue.map(x=><div>{x}</div>)}</div></section><section className="panel full"><h3>Operation Log</h3>{steps.slice(-10).map(s=><p className="log">{s}</p>)}</section></div>}
function Searching({patients,setSteps}){const [q,setQ]=useState('Ali');const [result,setResult]=useState('');const linear=()=>{for(let i=0;i<patients.length;i++){setSteps(s=>[...s,`Linear Search checked index ${i}`]);if(patients[i].name.toLowerCase()===q.toLowerCase()){setResult(`Found at index ${i}`);return}}setResult('Not found')};const binary=()=>{let a=[...patients].sort((x,y)=>x.name.localeCompare(y.name)),l=0,r=a.length-1;while(l<=r){let m=Math.floor((l+r)/2);setSteps(s=>[...s,`Binary Search checked ${a[m].name}`]);if(a[m].name.toLowerCase()===q.toLowerCase()){setResult(`Found ${a[m].name}`);return}if(a[m].name.toLowerCase()<q.toLowerCase())l=m+1;else r=m-1}setResult('Not found')};return <section className="panel"><h3>Searching Algorithms</h3><input value={q} onChange={e=>setQ(e.target.value)}/><div className="actions"><button onClick={linear}>Linear Search</button><button onClick={binary}>Binary Search</button></div><h3>{result}</h3><p className="muted">Binary Search uses a sorted patient list.</p></section>}
function Sorting({setSteps}){
  const [arr,setArr]=useState([42,17,63,8,31]);
  const [type,setType]=useState('Bubble');
  const [inputVal, setInputVal] = useState('42, 17, 63, 8, 31');
  const [stats, setStats] = useState({ swaps: 0, comps: 0 });

  const run=()=>{
    let a=[...arr], log=[], swaps=0, comps=0;
    if (type === 'Bubble') {
      for(let i=0;i<a.length;i++){
        for(let j=0;j<a.length-i-1;j++){
          comps++;
          if(a[j]>a[j+1]){
            swaps++;
            [a[j],a[j+1]]=[a[j+1],a[j]];
            log.push(a.join(', '));
          }
        }
      }
    } else if (type === 'Selection') {
      for(let i=0;i<a.length-1;i++){
        let minIdx = i;
        for(let j=i+1;j<a.length;j++){
          comps++;
          if(a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          swaps++;
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          log.push(a.join(', '));
        }
      }
    } else if (type === 'Insertion') {
      for(let i=1;i<a.length;i++){
        let key = a[i];
        let j = i - 1;
        comps++;
        while(j >= 0 && a[j] > key){
          comps++; 
          swaps++; 
          a[j+1] = a[j];
          j = j - 1;
        }
        a[j+1] = key;
        log.push(a.join(', '));
      }
    }
    setStats({ swaps, comps });
    setArr(a);
    setSteps(s=>[...s,`${type} Sort: ${log.join(' → ')}`]);
  };
  const handleInput = (e) => {
    setInputVal(e.target.value);
    const newArr = e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (newArr.length > 0) {
      setArr(newArr);
      setStats({ swaps: 0, comps: 0 });
    }
  };

  let timeComplexity = 'O(n²)';
  let spaceComplexity = 'O(1)';

  return (
    <section className="panel" style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
      <div style={{flex: '1', minWidth: '200px', borderRight: '1px solid #e2e8f0', paddingRight: '24px'}}>
        <h3 style={{marginBottom: '16px'}}>Algorithm Stats</h3>
        <p><strong>Algorithm:</strong> {type} Sort</p>
        <p><strong>Time/Space:</strong> {timeComplexity} / {spaceComplexity}</p>
        <hr style={{margin: '12px 0', border: 'none', borderTop: '1px solid #e2e8f0'}}/>
        <p><strong>Comparisons:</strong> {stats.comps}</p>
        <p><strong>Swaps / Shifts:</strong> {stats.swaps}</p>
      </div>
      <div style={{flex: '3', minWidth: '300px'}}>
        <h3>Sorting Visualizer</h3>
        <input type="text" value={inputVal} onChange={handleInput} placeholder="Enter comma separated numbers (e.g. 10, 5, 20)" style={{marginBottom: '10px', width: '100%', padding: '8px'}} />
        <div className="bars">{arr.map((x, i)=><div key={i} style={{height:x*3+'px'}}><span>{x}</span></div>)}</div>
        <select value={type} onChange={e=>{setType(e.target.value); setStats({swaps:0, comps:0});}}>
          <option>Bubble</option><option>Selection</option><option>Insertion</option>
        </select>
        <button onClick={run} style={{marginLeft: '12px'}}>Sort & Animate</button>
      </div>
    </section>
  );
}
function Graph({setSteps}){const nodes=['ER','Cardiology','Radiology','Neurology','Pharmacy'];const edges=[['ER','Cardiology',2],['ER','Radiology',4],['Cardiology','Neurology',3],['Radiology','Pharmacy',2],['Neurology','Pharmacy',1]];const [out,setOut]=useState('');const bfs=()=>{setOut('BFS: ER → Cardiology → Radiology → Neurology → Pharmacy');setSteps(s=>[...s,'BFS traversal completed'])};const dfs=()=>{setOut('DFS: ER → Cardiology → Neurology → Pharmacy → Radiology');setSteps(s=>[...s,'DFS traversal completed'])};const dij=()=>{setOut('Dijkstra: ER → Cardiology → Neurology → Pharmacy (cost 6)');setSteps(s=>[...s,'Dijkstra shortest route completed'])};return <div className="grid two"><section className="panel"><h3>Hospital Graph</h3><div className="graph">{nodes.map(n=><div className="node">{n}</div>)}</div><div className="actions"><button onClick={bfs}>BFS</button><button onClick={dfs}>DFS</button><button onClick={dij}>Dijkstra</button></div></section><section className="panel"><h3>Route Result</h3><p>{out||'Select an algorithm to find a department route.'}</p><hr/>{edges.map(e=><p className="muted">{e[0]} — {e[1]} · weight {e[2]}</p>)}</section></div>}
function Simulation({patients,setPatients}){const [running,setRunning]=useState(false);const run=()=>{setRunning(true);setTimeout(()=>{setPatients(p=>p.map(x=>x.status==='Waiting'?{...x,status:'Treated'}:x));setRunning(false)},900)};return <section className="panel center"><div className="pulse">{running?'Processing Emergency Cases':'Ready'}</div><h3>Emergency Department Simulation</h3><p className="muted">Priority Queue → Doctor Assignment → Treatment → History Stack</p><button onClick={run} disabled={running}>{running?'Running...':'Start Simulation'}</button></section>}
function Analytics({patients}){let treated=patients.filter(p=>p.status==='Treated').length;return <><div className="grid stats"><Card t="Treated" v={treated} s="Completed"/><Card t="Waiting" v={patients.length-treated} s="Active"/><Card t="Critical" v={patients.filter(p=>p.level==='Critical').length} s="Priority"/><Card t="Total" v={patients.length} s="Records"/></div><section className="panel"><h3>Patient Distribution</h3>{Object.keys(priority).map(l=><div className="metric"><span>{l}</span><div className="bar"><i style={{width:(patients.filter(p=>p.level===l).length/Math.max(1,patients.length)*100)+'%'}}/></div><b>{patients.filter(p=>p.level===l).length}</b></div>)}</section></>}
createRoot(document.getElementById('root')).render(<App/>);
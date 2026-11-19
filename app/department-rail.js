'use client';

import {useEffect,useRef,useState} from 'react';
import {IconChevronLeft,IconChevronRight} from '@tabler/icons-react';

export default function DepartmentRail({children}) {
  const rail=useRef(null);
  const [edges,setEdges]=useState({start:true,end:false});
  useEffect(()=>{
    const element=rail.current;
    function update(){const position=Math.abs(element.scrollLeft);setEdges({start:position<2,end:position>=element.scrollWidth-element.clientWidth-2});}
    update();element.addEventListener('scroll',update,{passive:true});
    const observer=new ResizeObserver(update);observer.observe(element);
    return ()=>{element.removeEventListener('scroll',update);observer.disconnect();};
  },[]);
  function move(direction){const element=rail.current;const column=element.querySelector('.department');element.scrollBy({left:direction*(column?.getBoundingClientRect().width||300),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
  return <section className="department-rail" aria-label="الأقسام الإخبارية">
    <div className="department-rail-controls"><button type="button" aria-label="الأقسام السابقة" aria-controls="department-columns" disabled={edges.start} onClick={()=>move(1)}><IconChevronRight size={18}/></button><button type="button" aria-label="الأقسام التالية" aria-controls="department-columns" disabled={edges.end} onClick={()=>move(-1)}><IconChevronLeft size={18}/></button></div>
    <div ref={rail} id="department-columns" className="department-columns">{children}</div>
  </section>;
}

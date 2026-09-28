(function (root) {
  const ns = 'http://www.w3.org/2000/svg';
  function node(tag,attrs,text) {
    const el=document.createElementNS(ns,tag);
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    if(text !== undefined) el.textContent=text;
    return el;
  }
  function render(host,a,b,steps,distance=false) {
    const min=Math.min(-10,a-b-1), max=Math.max(10,a+1,distance ? b+1 : a+1);
    const unit=42, width=(max-min)*unit+64, x=n=>32+(n-min)*unit;
    const svg=node('svg',{viewBox:`0 0 ${width} 180`,width,height:180,role:'img','aria-label':distance ? `Distancia entre ${a} y ${b}: ${Math.abs(a-b)} unidades` : `Empiezas en ${a}. Paso ${steps} de ${b}. Estás en ${a-steps}.`});
    svg.append(node('rect',{x:x(min),y:105,width:x(0)-x(min),height:43,rx:12,fill:'#eee6fa'}));
    svg.append(node('rect',{x:x(0),y:105,width:x(max)-x(0),height:43,rx:12,fill:'#e4f0eb'}));
    svg.append(node('line',{x1:12,y1:106,x2:width-12,y2:106,stroke:'#92908e','stroke-width':2}));
    for(let n=min;n<=max;n++) {
      svg.append(node('line',{x1:x(n),y1:n===0?92:100,x2:x(n),y2:114,stroke:n===0?'#252d29':'#92908e','stroke-width':n===0?3:1}));
      svg.append(node('text',{x:x(n),y:137,'text-anchor':'middle',fill:n<0?'#69469a':'#315c4b','font-size':n===0?18:14,'font-weight':n===0?800:500},String(n).replace('-','−')));
    }
    if (distance) {
      svg.append(node('path',{d:`M ${x(a)} 88 V 64 H ${x(b)} V 88`,fill:'none',stroke:'#845aaa','stroke-width':3}));
      svg.append(node('text',{x:(x(a)+x(b))/2,y:44,'text-anchor':'middle',fill:'#69469a','font-size':18},`${Math.abs(a-b)} unidades`));
    } else {
      for(let i=0;i<steps;i++) {
        svg.append(node('path',{d:`M ${x(a-i)} 98 Q ${x(a-i)-21} 52 ${x(a-i-1)} 98`,fill:'none',stroke:'#9f87bc','stroke-width':2}));
        svg.append(node('path',{d:`M ${x(a-i-1)-2} 89 L ${x(a-i-1)} 98 L ${x(a-i-1)+8} 94`,fill:'none',stroke:'#9f87bc','stroke-width':2}));
      }
      svg.append(node('circle',{cx:x(a),cy:106,r:5,fill:'#315c4b'}));
      const pos=a-steps;
      svg.append(node('rect',{x:x(pos)-23,y:8,width:46,height:36,rx:12,fill:'#2c493e'}));
      svg.append(node('text',{x:x(pos),y:32,'text-anchor':'middle',fill:'white','font-size':18,'font-weight':700},String(pos).replace('-','−')));
      svg.append(node('path',{d:`M ${x(pos)-6} 44 L ${x(pos)} 52 L ${x(pos)+6} 44`,fill:'#2c493e'}));
      svg.append(node('circle',{cx:x(pos),cy:106,r:7,fill:'#2c493e',stroke:'white','stroke-width':2}));
    }
    host.replaceChildren(svg);
    const scroll=host.parentElement;
    const focus=distance?(a+b)/2:a-steps;
    scroll.scrollLeft=Math.max(0,x(focus)-scroll.clientWidth/2);
  }
  root.NumberLine={render};
})(window);

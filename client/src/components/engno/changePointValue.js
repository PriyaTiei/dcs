import React from 'react'

function changePointValue({station, m4, abnormality, breakdown, rework}) {
  var highlight_s="";
  var highlight_m="";
  var highlight_a="";
  var highlight_b="";
  var highlight_r="";

  if( m4 =="Available"){
    highlight_m="yesHighlight";
    highlight_s="yesHighlight";
  }
  else if(abnormality =="Available"){
    highlight_a="yesHighlight";
    highlight_s="yesHighlight";

  }
  else if(breakdown =="Available"){
    highlight_b="yesHighlight";
    highlight_s="yesHighlight";

  }else if(rework =="Available"){
    highlight_r="yesHighlight";
    highlight_s="yesHighlight";

  }

  return (
    <>
      <div className={`p-2 border ${highlight_s}`}>{station}</div>
      <div className={`p-2 border ${highlight_m}`}>{m4}</div>
      <div className={`p-2 border ${highlight_a}`}>{abnormality}</div>
      <div className={`p-2 border ${highlight_b}`}>{ breakdown}</div>
      <div className={`p-2 border ${highlight_r}`}>{rework}</div>
    </>
  )
}

export default changePointValue
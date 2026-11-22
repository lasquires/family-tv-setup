'use strict';
const $=id=>document.getElementById(id);let step=0,downloaded=false;
function render(focus=false){
 document.querySelectorAll('[data-step]').forEach(panel=>panel.hidden=Number(panel.dataset.step)!==step);
 $('progress').textContent='Step '+(step+1)+' of 4';$('track').style.width=((step+1)*25)+'%';$('back').hidden=step===0;
 $('next').textContent=step===3?'Open Home':'Next';$('next').disabled=step===0&&(!$('tvWifi').checked||!$('computerWifi').checked)||step===1&&!downloaded;
 $('downloadNote').textContent=step===1&&!downloaded?'Download the installer, then choose Next.':'';
 const win=$('os').value==='windows';$('openInstruction').textContent=win?'Open Downloads. Right-click family-tv-setup.zip, choose Extract All, then Extract. Open the extracted family-tv-setup folder.':'Open Downloads and double-click family-tv-setup.zip to unpack it. Open the new family-tv-setup folder.';
 const lines=win?['Open the installer folder.','Double-click Start-Setup.cmd.','If Windows Firewall asks, allow access on your private home network.']:['Open Terminal in the extracted family-tv-setup folder.','Run: bash installer/Start-Setup.command','Follow the launcher’s instructions. Python 3 is required; on Mac it opens the official download page if needed.'];
 $('instructions').replaceChildren(...lines.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('help').textContent=win?'Make sure the ZIP is extracted first. Keep the command window open until setup finishes.':'On Mac, open Terminal from Applications → Utilities. Type cd followed by a space, drag the extracted family-tv-setup folder into Terminal, and press Return. Then paste bash installer/Start-Setup.command and press Return. Keep Terminal open until setup finishes.';
 const h=document.querySelector('[data-step="'+step+'"] h1');h.tabIndex=-1;if(focus===true)h.focus({preventScroll:true});
}
$('next').onclick=()=>{if(step===3){location.href='../';return;}step++;render(true);};$('back').onclick=()=>{step--;render(true);};$('download').onclick=()=>{downloaded=true;render();};$('os').onchange=render;$('tvWifi').onchange=render;$('computerWifi').onchange=render;render();

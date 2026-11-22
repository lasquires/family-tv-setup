const os=document.getElementById('os'),instructions=document.getElementById('instructions');
function render(){instructions.replaceChildren();const items=os.value==='windows'?
 ['Extract the downloaded ZIP. Open the family-tv-setup folder, then installer.','Double-click Start-Setup.cmd. It prepares a verified portable Python runtime and opens the wizard.','Keep its terminal window open. If Windows Firewall asks, allow the connection on your private home network.']:
 ['Extract the ZIP. Open the family-tv-setup folder.','Open Terminal in that folder and run: bash installer/Start-Setup.command','Python 3 is required on Mac/Linux. The Mac launcher opens the official download page if it is missing.'];
const list=document.createElement('ol');for(const item of items){const li=document.createElement('li');li.textContent=item;li.style.margin='14px 0';li.style.lineHeight='1.6';list.append(li);}instructions.append(list);}
os.onchange=render;render();

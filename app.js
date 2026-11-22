import {commands,validate,PIN} from './commands.mjs';
const $=id=>document.getElementById(id);
const names=['Your setup','Get the tools','Check the TV','Install','Verify'];
let step=0;const state={mode:'check',kit:'',os:navigator.platform.startsWith('Win')?'windows':'mac',host:'',label:'Living room',owner:'',key:'',known:'',ready:false,base:false};
function element(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
function text(value,cls){$('content').append(element('p',value,cls));}
function field(label,id,placeholder,type='text'){
 const l=element('label',label);l.htmlFor=id;const input=document.createElement('input');input.id=id;input.type=type;input.placeholder=placeholder;input.value=state[id];input.autocomplete='off';input.spellcheck=false;input.oninput=()=>state[id]=input.value;$('content').append(l,input);
}
function check(id,label){const l=element('label',null,'check'),input=document.createElement('input');input.type='checkbox';input.checked=state[id];input.onchange=()=>state[id]=input.checked;l.append(input,document.createTextNode(label));$('content').append(l);}
function block(title,code){const section=element('div',null,'command'),head=element('div',null,'command-head'),copy=element('button','Copy','copy');copy.onclick=async()=>{try{await navigator.clipboard.writeText(code);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy',1800);}catch{copy.textContent='Select text below';}};head.append(document.createTextNode(title),copy);section.append(head,element('pre',code));$('content').append(section);}
function render(){
 $('steps').replaceChildren(...names.map((n,i)=>{const item=element('div',null,'step '+(i===step?'current':i<step?'done':''));item.append(element('strong',i<step?'✓':String(i+1)),document.createTextNode(n));if(i===step)item.setAttribute('aria-current','step');return item;}));
 $('counter').textContent=`Step ${step+1} of 5`;$('content').replaceChildren();$('error').textContent='';$('back').disabled=step===0;$('next').textContent=step===4?'Download my checklist':'Continue →';
 if(step===0){
  $('title').textContent='Let’s find your TV.';$('description').textContent='Start with a simple connection check. No passwords, accounts or TV changes are needed for this first step.';
  const l=element('label','Your computer');l.htmlFor='os';const select=document.createElement('select');select.id='os';for(const [value,label] of [['windows','Windows · PowerShell'],['mac','Mac · Terminal'],['linux','Linux · Terminal']]){const o=element('option',label);o.value=value;select.append(o);}select.value=state.os;select.onchange=()=>state.os=select.value;$('content').append(l,select);
  if(state.mode==='check'){
    field('Your TV’s IP address','host','192.168.1.50');text('On the TV, open Network settings and look for IP address. Connect your computer to the same Wi-Fi.','hint');
    text('This is an early-access installer for supported LG TVs. The first check is read-only. Full setup requires compatible TV access and a private household connection.','note');
    const kit=element('button','I already have a private setup kit','secondary');kit.onclick=()=>{state.mode='guided';render();};$('content').append(kit);return;
  }
  if(state.mode==='guided'){
    field('Private setup kit location','kit','Full path to setup-kit.json');
    text('This is a file on your computer, supplied by the person preparing your home. Enter its location, not its contents. No kit yet? Ask your setup operator before continuing.','hint');
    check('ready','My setup operator has prepared this TV, its access, and a private kit for my household.');
    const advanced=element('button','I’m the setup operator · show technical steps','secondary');advanced.style.marginTop='16px';advanced.onclick=()=>{state.mode='advanced';state.ready=false;render();};$('content').append(advanced);return;
  }
  field('TV address','host','192.168.1.50');text('Find this in the TV’s network settings or your router’s device list.','hint');field('Room name','label','Living room');
  field('Household access file','owner','Full path to owner.json');field('Authorized SSH key file','key','Full path to your private SSH key');field('Verified TV host keys file','known','Full path to known_hosts');
  text('Your setup operator supplies the household access file after creating your home on the new service. SSH access must already be authorized on this TV. Use full file paths; keep their contents private.','warning');
  check('base','This TV has no Glasshouse server yet. Include the fresh server installation step.');
  check('ready','I have a prepared LG TV, verified SSH access, a working household access file, and confirmation that this TV supports the pinned Family TV installation.');
  return;
 }
 const c=commands(state);
 if(state.mode==='check'){
  if(step===1){$('title').textContent='Download your setup tools.';$('description').textContent='One small ZIP for Windows, Mac and Linux. No GitHub account required.';
   const download=element('a','Download Family TV setup','download');download.href='./downloads/family-tv-setup.zip';download.download='family-tv-setup.zip';$('content').append(download);
   text('Open the download and extract it. Inside, open the family-tv-setup folder.','success');
   text(state.os==='windows'?'Right-click inside the folder and choose Open in Terminal. Use PowerShell.':'Open Terminal in the extracted family-tv-setup folder.','hint');
   block('Check the tools on your computer',c.prerequisites);text('Both commands should show a version. Missing Python? Install Python 3 from python.org. Missing SSH? Enable the OpenSSH client on Windows; it is normally available on Mac.','hint');
  }else if(step===2){$('title').textContent='Check the connection.';$('description').textContent='Paste this into the terminal in your extracted folder. It checks only the TV you selected.';block('Read-only TV check',c.check);text('This connects to ports 22 and 8080. It sends no passwords or TV commands and installs nothing.','success');text('If both ports say “not reachable,” check Wi-Fi, the address and that the TV is awake. It may also need preparation; keep the results for your setup helper.','hint');
  }else if(step===3){$('title').textContent='Check that this TV is supported.';$('description').textContent='Before installing, collect a few details from the TV settings.';for(const t of ['Exact TV model number','Software or firmware version','Whether Homebrew Channel is installed','The connection-check output from your terminal'])text('• '+t);text('Share these details with the person helping you set up Family TV. An open network port does not prove the TV is compatible or that installation access is authorized.','warning');
  }else{$('title').textContent='Ready for the next step.';$('description').textContent='Your connection check is the first step, not a completed installation.';text('Your helper checks compatibility, prepares authorized TV access, and creates your separate private household. The household backend is operator-managed during this pilot.','note');const ready=element('button','Continue with my private setup kit');ready.onclick=()=>{state.mode='guided';step=0;render();};$('content').append(ready);text('No kit yet? Keep your TV details and the connection results. Your existing TV and household have not been changed by these checks.','hint');}
  return;
 }
 if(state.mode==='guided'&&step===1){
   $('title').textContent='Unzip. Open. You’re ready to begin.';$('description').textContent='Download the installer and keep your private setup kit on your computer.';
   const download=element('a','Download Family TV setup','download');download.href='./downloads/family-tv-setup.zip';download.download='family-tv-setup.zip';$('content').append(download);
   text('Extract the ZIP into a new folder. Open the family-tv-setup folder inside it. No GitHub account or Git commands are needed for this package.','success');
   text(state.os==='windows'?'In that folder, right-click and choose Open in Terminal, then use PowerShell. You can also ask your operator to run installer/Start-Setup.ps1.':'Open Terminal in that folder. The installer/Start-Setup.command launcher can also guide you when run with bash.','hint');
   block('Check your computer’s tools',c.prerequisites);text('Both should show a version. If Python or SSH is missing, ask your setup operator to install it before continuing.','warning');return;
 }
 if(state.mode==='guided'&&step>=2){
   if(step===2){$('title').textContent='Start the guided installer.';$('description').textContent='Keep this computer on the TV’s Wi-Fi. Run this in the Family TV project folder.';block('Start setup',c.guided);text('The installer checks your household connection, asks for the TV address and room name, then shows a summary before you approve installation.','success');text('If it reports missing access, an existing installation or an unsupported prerequisite, stop and ask your operator. It will not take over an existing Family TV setup.','hint');}
   else if(step===3){$('title').textContent='Let the installer finish.';$('description').textContent='Follow the prompts in your terminal. This page cannot see the installer’s progress.';text('You should see “Installed and completed one authenticated sync.” Keep any recovery job path if the installer stops partway through.','success');text('Do not rerun setup from the beginning after a partial installation. Your operator can resume the saved job or inspect and recover it.','warning');}
   else{$('title').textContent='Check it together.';$('description').textContent='Before handing over, have your setup operator verify these checks.';for(const t of ['Your room appears only in your household.','A harmless refresh command is confirmed by the TV.','A short timed grant expires correctly.','The TV reconnects after a cold boot.'])text('✓ '+t);text('Installation and physical checks are separate. This screen does not certify that your TV is connected.','warning');}
   return;
 }
 if(step===1){$('title').textContent='Open a terminal. We’ll guide you.';$('description').textContent=state.os==='windows'?'Open Windows PowerShell from the Start menu. Paste one block at a time.':'Open Terminal on your computer. Paste one block at a time.';block('Check installed tools',c.prerequisites);text('Each command should print a version. If one is missing, install Git, Python 3, or OpenSSH before continuing.','success');
  text('Choose a folder for the project, then copy the block below. For an existing checkout, open that folder instead—do not clone into it again. These commands require the new installer files to have been published to GitHub.','hint');block('Download Family TV',c.download);text('Stay in this terminal and project folder for the remaining steps. A private repository may ask you to sign into GitHub.','hint');
 }else if(step===2){$('title').textContent='Check this TV before installing.';$('description').textContent='Connect this computer to the same home network. These commands use the address and verified SSH key you selected.';
  if(state.base){text('Fresh install only. This starts a server on the TV and refuses to overwrite an existing installation. If you are unsure whether one is already installed, ask your setup operator first.','warning');block('Install the base server',c.base);}
  block('Check access and server',c.inspect);text('Look for a running service. If access fails, stop here. Check the address, authorized key and TV host fingerprint. Do not turn off host-key checking.','success');text('Compatibility baseline: '+PIN+'. The check verifies access and prerequisites; it does not certify every LG model or firmware.','hint');
 }else if(step===3){$('title').textContent='Connect it to your household.';$('description').textContent='Enrollment lasts ten minutes. Run the first command when you are ready, then the installation command.';block('Create a one-time enrollment',c.enroll);block('Install Family TV',c.install);text('Wait for “Installed and completed one authenticated sync.” The installer refuses an existing Family TV setup and keeps your credentials on your computer and TV.','success');text('Interrupted? Keep the generated job file. Use this to resume the same installation after checking the TV and network.','hint');block('Resume this installation',c.resume);
 }else{$('title').textContent='Make sure your TV checks in.';$('description').textContent='This page cannot observe your terminal or TV. Complete the checks below before handing it over.';block('List your household’s TVs',c.verify);text('Look for your room and a recent received timestamp. Copy its device ID for status checks. Your original home should not appear in this household.','success');block('Check command results · replace DEVICE-UUID',c.status);text('Test a short timed grant using the operator runbook, check that it expires, then cold-boot the TV and check it reconnects. An IP address change will not change its household identity.','hint');const summary=element('div',null,'summary');for(const [key,value] of [['Room',state.label],['TV address',state.host],['Computer',state.os]])summary.append(element('span',key),element('strong',value));$('content').append(summary);text('Not a success screen yet: a real TV check and a confirmed command are still required.','warning');}
}
$('back').onclick=()=>{if(step>0){step--;render();}};
$('next').onclick=()=>{try{validate(state);if(step===4){const c=commands(state);const data='Family TV setup checklist\n\nNo secrets are included, but these commands contain your local file paths.\n\n'+Object.entries(c).filter(([k])=>k!=='base'||state.base).map(([k,v])=>k.toUpperCase()+'\n'+v).join('\n\n');const url=URL.createObjectURL(new Blob([data],{type:'text/plain'}));const a=element('a');a.href=url;a.download='family-tv-setup.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}step++;render();$('title').scrollIntoView({behavior:'smooth',block:'center'});}catch(e){$('error').textContent=e.message;}};
render();

export const PIN='0a110e74a0c1256134a4ff93f351919023306d07';
export function quote(value,os){if(/[\r\n\0]/.test(value))throw Error('Use a single-line value.');return os==='windows'?"'"+value.replaceAll("'","''")+"'":"'"+value.replaceAll("'","'\"'\"'")+"'";}
export function validIP(value){const parts=value.split('.');if(parts.length!==4||parts.some(p=>!/^\d{1,3}$/.test(p)||Number(p)>255||String(Number(p))!==p))return false;const [a,b]=parts.map(Number);return a===10||a===192&&b===168||a===172&&b>=16&&b<=31;}
export function validate(s){
 if(!['windows','mac','linux'].includes(s.os))throw Error('Choose your computer.');
 if(s.mode==='check'){
   if(!validIP(s.host))throw Error('Enter the TV’s local IPv4 address, such as 192.168.1.50.');
   return;
 }
 if(s.mode==='guided'){
   if(!s.kit?.trim()||/[\r\n\0]/.test(s.kit))throw Error('Enter the local path to your private setup kit.');
   if(!s.ready)throw Error('Confirm your setup operator has prepared the TV and private kit.');
   return;
 }
 if(!validIP(s.host))throw Error('Enter the TV’s local IPv4 address, such as 192.168.1.50.');
 for(const k of ['owner','key','known'])if(!s[k]?.trim()||/[\r\n\0]/.test(s[k]))throw Error('Enter single-line local file paths.');
 if(!s.label.trim()||s.label.length>60||/[\r\n\0]/.test(s.label))throw Error('Enter a room name of up to 60 characters.');
 if(!s.ready)throw Error('Confirm that your TV access and household have been prepared.');
}
export function commands(s){
 validate(s);const q=v=>quote(v,s.os),py=s.os==='windows'?'py -3':'python3';
 if(s.mode==='check')return {
   prerequisites:s.os==='windows'?'py -3 --version\nssh -V':'python3 --version\nssh -V',
   check:py+' installer/setup.py preflight --host '+q(s.host)
 };
 if(s.mode==='guided')return {
   prerequisites:s.os==='windows'?'py -3 --version\nssh -V':'python3 --version\nssh -V',
   guided:py+' installer/setup.py guided --kit '+q(s.kit)
 };
 const cli=py+' installer/setup.py',args=` --host ${q(s.host)} --key ${q(s.key)} --known-hosts ${q(s.known)}`;
 const folder='.local/setup-'+s.host.replaceAll('.','-');
 return {
  prerequisites:s.os==='windows'?'git --version\npy -3 --version\nssh -V':'git --version\npython3 --version\nssh -V',
  download:'git clone https://github.com/lasquires/family-tv.git\n'+(s.os==='windows'?'Set-Location family-tv':'cd family-tv')+'\ngit clone https://github.com/rorygallagher2024/glasshouse.git vendor/glasshouse\ngit -C vendor/glasshouse checkout '+PIN,
  base:cli+' install-base'+args,
  inspect:cli+' inspect'+args,
  enroll:cli+' enroll --owner '+q(s.owner)+' --label '+q(s.label)+' --out '+q(folder+'/enrollment.json'),
  install:cli+' install'+args+' --enrollment '+q(folder+'/enrollment.json')+' --job '+q(folder+'/job.json')+' --upstream-verified '+PIN,
  verify:cli+' devices --owner '+q(s.owner),
  resume:cli+' install --resume'+args+' --job '+q(folder+'/job.json')+' --upstream-verified '+PIN,
  status:cli+' status --owner '+q(s.owner)+' --device DEVICE-UUID',
 };
}

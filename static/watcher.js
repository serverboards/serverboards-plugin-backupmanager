(function () {
'use strict';

var _Serverboards$1=Serverboards;
var rpc$1=_Serverboards$1.rpc;
var plugin_id$1='serverboards.backup.monitor';
// from MDN https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
function hex(a){var b=[],c=new DataView(a);for(var d=0;d<c.byteLength;d+=4){// Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
var f=c.getUint32(d),g=f.toString(16),h='00000000',j=(h+g).slice(-h.length);// toString(16) will give the hex representation of the number without padding
// We use concatenation and slice for padding
b.push(j)}// Join all the hex strings into one
return b.join('')}function old_backup(a){// must match today date or yesterdays
var b=new Date().toISOString().slice(0,10),c=new Date;c.setDate(c.getDate()-1);var d=c.toISOString().slice(0,10);return a==b||a==d}function get_servername(a){var b=new Promise(function(c,d){rpc$1.call('service.get',[a]).then(function(f){c(f.name)}).catch(function(f){d(f)})});return b}function get_state(_ref){var a=_ref.file_expression,b=_ref.service,c=new TextEncoder('utf-8').encode(a+'-'+b),d=crypto.subtle.digest('SHA-256',c).then(function(f){var g='test-'+hex(f);return rpc$1.call('plugin.data.get',[plugin_id$1,g])}).then(function(f){if(!f.filename)return{color:'red',state:'Cant get data from any backup. Maybe not performed yet?'};var g=old_backup(f.datetime);return{filename:f.filename,datetime:f.datetime.slice(0,16).replace('T',' '),color:g?'red':'green',state:g?'Old backup. Check ASAP':'Ok',size:f.size}}).catch(function(f){return console.error(f),{color:'red',state:f.toString()}});return d}

var _Serverboards=Serverboards;
var React=_Serverboards.React;
var rpc=_Serverboards.rpc;
var i18n=_Serverboards.i18n;
var plugin_id='serverboards.backup.monitor';
var Widget=Serverboards.React.createClass({getInitialState:function getInitialState(){return{files:[]}},componentDidMount:function componentDidMount(){var _this=this;rpc.call('rules.list',{project:this.props.project}).then(function(a){var b=a.filter(function(c){return plugin_id+'/file_exists'==c.trigger.trigger&&c.is_active}).map(function(c){return{is_active:c.is_active,file_expression:c.trigger.params.file_expression,service_uuid:c.service,uuid:c.uuid}});_this.setState({files:b})})},render:function render(){this.props;var a=this.state;return 0==a.files.length?React.createElement('div',null,i18n('No backups are being watched.')):React.createElement('table',{className:'ui very basic selectable table'},React.createElement('tbody',null,a.files.map(function(b){return React.createElement(BackupFileRow,{file:b})})))}});
var BackupFileRow=React.createClass({displayName:'BackupFileRow',getInitialState:function getInitialState(){var a=this.props.file;return{servername:void 0,filename:a.file_expression,datetime:void 0,color:'blue',state:'Gathering information',size:void 0}},componentDidMount:function componentDidMount(){var _this2=this,a=this.props.file;get_servername(this.props.file.service_uuid).then(function(b){_this2.setState({servername:b})}),get_state({file_expression:a.file_expression,service:a.service_uuid}).then(function(b){return _this2.setState(b)})},render:function render(){var a=this.state;return React.createElement('tr',{style:{cursor:'pointer'}},React.createElement('td',{style:{padding:'10px 10px'}},React.createElement('div',{className:'ui oneline','data-tooltip':a.filename,title:a.filename},a.filename),React.createElement('div',{className:'ui meta'},a.servername)),React.createElement('td',{style:{width:100}},'Ok'==a.state?React.createElement('div',null,React.createElement('b',{style:{fontSize:'1.1em'}},'OK')):React.createElement('div',{className:'ui text '+a.color},React.createElement('b',null,a.state)),React.createElement('div',null,React.createElement('b',null,a.size?a.size.toFixed(2)+' MB':'')),React.createElement('div',{className:'ui oneline',style:{fontSize:'12px',color:'#666'}},a.datetime)),React.createElement('td',{title:a.state,style:{textAlign:'right'},style:{width:10,height:'100%'}},React.createElement('i',{className:'ui label rectangular '+a.color})))}});
function main(a,b,_ref){var c=_ref.project;return Serverboards.ReactDOM.render(React.createElement(Widget,{config:b,project:c}),a),function(){Serverboards.ReactDOM.unmountComponentAtNode(a)}}Serverboards.add_widget(plugin_id+'/watcher',main);

}());
//# sourceMappingURL=watcher.js.map

(this["webpackJsonpdevice-demonstrator"]=this["webpackJsonpdevice-demonstrator"]||[]).push([[0],{14:function(e,t,n){e.exports=n(21)},19:function(e,t,n){},21:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(10),i=n.n(c),u=(n(19),n(1)),o=n(2),s=n.n(o),l=n(4),d=function(e){return e.hide?null:a.a.createElement(a.a.Fragment,null,e.children)},m=function(e){var t=e.content,n=JSON.stringify(t,null,2);return a.a.createElement("pre",null,n)},v=function(e){var t=e.error;return a.a.createElement("div",null,a.a.createElement("h1",null,t.name),a.a.createElement(m,{content:t}))},f=function(e){var t=e.track,n=t.getCapabilities?t.getCapabilities():"track.getCapabilities does not exist";return a.a.createElement("dl",null,a.a.createElement("dt",null,"id"),a.a.createElement("dd",null,e.id),a.a.createElement("dt",null,"readyState"),a.a.createElement("dd",null,e.readyState),a.a.createElement("dt",null,"enabled"),a.a.createElement("dd",null,String(e.enabled)),a.a.createElement("dt",null,"kind"),a.a.createElement("dd",null,e.kind),a.a.createElement("dt",null,"label"),a.a.createElement("dd",null,e.label),a.a.createElement("dt",null,"muted"),a.a.createElement("dd",null,String(e.muted)),a.a.createElement("dt",null,"capabilities"),a.a.createElement("dd",null,a.a.createElement(m,{content:n})),a.a.createElement("dt",null,"constraints"),a.a.createElement("dd",null,a.a.createElement(m,{content:t.getConstraints()})),a.a.createElement("dt",null,"settings"),a.a.createElement("dd",null,a.a.createElement(m,{content:t.getSettings()})))},b=n(13),h=function(e){var t=e.srcObject,n=void 0===t?null:t,c=e.muted,i=void 0!==c&&c,u=Object(b.a)(e,["srcObject","muted"]),o=Object(r.useRef)(null);return Object(r.useEffect)((function(){var e=o.current;null!==e&&(e.srcObject!==n&&(e.srcObject=n),e.muted!==i&&(e.muted=i))}),[n,i]),a.a.createElement("video",Object.assign({},u,{ref:o}))},p=function(e){var t=e.stream,n=Object(r.useState)(!0),c=Object(u.a)(n,2),i=(c[0],c[1]),o=function(){i((function(e){return!e}))},s=function(){return null===t?[]:t.getTracks()},l=s().map((function(e){return a.a.createElement("li",{key:e.id},a.a.createElement(f,{enabled:e.enabled,id:e.id,kind:e.kind,label:e.label,muted:e.muted,readyState:e.readyState,track:e}))}));return a.a.createElement("div",{style:{display:"flex"}},a.a.createElement("h1",null,"Scenario View"),a.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},a.a.createElement("button",{onClick:function(){s().forEach((function(e){return e.enabled=!1})),o()}},"pause"),a.a.createElement("button",{onClick:function(){s().forEach((function(e){return e.enabled=!0})),o()}},"continue"),a.a.createElement("button",{onClick:function(){s().forEach((function(e){return e.stop()})),o()}},"stop")),a.a.createElement(h,{id:"video-chat",srcObject:t,autoPlay:!0}),t&&a.a.createElement("div",null,a.a.createElement("h2",null,"stream"),a.a.createElement("ul",null,a.a.createElement("li",null,"id: ",t.id),a.a.createElement("li",null,"active: ",JSON.stringify(t.active))),a.a.createElement("h2",null,"tracks"),a.a.createElement("ul",null,l)))},E=function(e){return function(){var t=Object(l.a)(s.a.mark((function t(n){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=e,t.next=3,n;case 3:return t.t1=t.sent,t.abrupt("return",(0,t.t0)(t.t1));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},g=function(e){return function(){var t=Object(l.a)(s.a.mark((function t(n){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n;case 3:return t.abrupt("return",{success:!1,messages:["expected a rejected promise"]});case 6:return t.prev=6,t.t0=t.catch(0),t.abrupt("return",e(t.t0));case 9:case"end":return t.stop()}}),t,null,[[0,6]])})));return function(e){return t.apply(this,arguments)}}()},k={summary:"bogus device id",description:"the constraint contains a deviceId that no device has",constraints:{audio:{deviceId:"bogus"}},expected:{description:"fallback to any other audio device",checks:[{what:"stream is active",predicate:E((function(e){return{success:e.active}}))},{what:"stream has an id",predicate:E((function(e){return{success:e.id.length>0}}))}]}},y={summary:"existing device",description:"the constraint contains a deviceId of an existing device",constraints:{video:{deviceId:"77df7c3d3f24890c51364752fb295895fbebdc821755f6706f5bcd06e6e63269"}},expected:{description:"tbd",checks:[]}},O={summary:"undefined constraints",description:"pass undefined as constraints",constraints:void 0,expected:{description:"reject and communicate that at least one constrain has to be present",checks:[{what:"TypeError",predicate:g((function(e){return{success:e instanceof TypeError,messages:["got: ".concat(e.toString())]}}))},{what:"error message",predicate:g((function(e){var t="Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested";return{success:e.message===t,messages:["expected: ".concat(t),"got: '".concat(e.message,"'")]}}))}]}},j=function(){var e=new Map;return e.set(k.summary,k),e.set(y.summary,y),e.set(O.summary,O),e}(),C=function(e){return e instanceof Error?Promise.reject(e):Promise.resolve(e)},S=function(){var e=Object(r.useState)(),t=Object(u.a)(e,2),n=t[0],c=t[1],i=Object(r.useState)(""),o=Object(u.a)(i,2),f=o[0],b=o[1],h=Object(r.useState)(!1),E=Object(u.a)(h,2),g=E[0],k=E[1],y=Object(r.useState)(),O=Object(u.a)(y,2),S=O[0],D=O[1],w=Object(r.useState)(null),x=Object(u.a)(w,2),I=x[0],L=x[1],R=Object(r.useState)([]),P=Object(u.a)(R,2),F=P[0],U=P[1];Object(r.useEffect)((function(){try{var e="undefined"===f?void 0:JSON.parse(f);D(e),k(!1)}catch(t){k(!0)}}),[f,k]),Object(r.useEffect)((function(){var e;if(void 0!==n){var t=null===(e=j.get(n))||void 0===e?void 0:e.constraints,r=void 0===t?"undefined":JSON.stringify(t,null,2);b(r)}else{var a=Array.from(j.keys())[0];c(a)}}),[n]),Object(r.useEffect)((function(){U((function(){return[]}))}),[n]);var _=function(){var e=Object(l.a)(s.a.mark((function e(){var t,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==(t=j.get(null!==n&&void 0!==n?n:""))&&null!==I){e.next=3;break}return e.abrupt("return");case 3:return r=t.expected.checks.map(function(){var e=Object(l.a)(s.a.mark((function e(t){var n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.predicate(C(I));case 3:n=e.sent,e.next=10;break;case 6:e.prev=6,e.t0=e.catch(0),r=["check threw exception ".concat(e.t0.toString())],n={success:!1,messages:r};case 10:return e.abrupt("return",{what:t.what,details:n});case 11:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}()),e.t0=U,e.next=7,Promise.all(r);case 7:e.t1=e.sent,(0,e.t0)(e.t1);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return a.a.createElement("div",null,a.a.createElement("h1",{key:"test-rig"},"Test Rig",g?" (parse error)":""),a.a.createElement("select",{name:"scenarios",onChange:function(e){return c(e.target.value)}},Array.from(j.keys()).map((function(e){return a.a.createElement("option",{value:e,key:e},e)}))),a.a.createElement("textarea",{value:f,onChange:function(e){return b(e.target.value)}}),a.a.createElement("button",{onClick:function(){navigator.mediaDevices.getUserMedia(S).then((function(e){return L((function(){return e}))})).catch((function(e){return L((function(){return e}))}))}},"start"),a.a.createElement("button",{disabled:null===I,onClick:_},"run checks"),a.a.createElement("button",{onClick:function(){U((function(){return[]}))}},"clear checks"),a.a.createElement("button",{onClick:function(){L(null)}},"detach"),a.a.createElement("ul",{key:"results"},F.map((function(e,t){var n,r=e.details.success?"\u2705":"\u274c",c=null!==(n=e.details.messages)&&void 0!==n?n:[],i=!e.details.success&&0!==c.length?a.a.createElement("ul",{key:"message ".concat(t)},c.map((function(e,n){return a.a.createElement("li",{key:"message ".concat(t," ").concat(n)},e)}))):null;return a.a.createElement(a.a.Fragment,{key:"doombuggy ".concat(t)},a.a.createElement("li",{key:"check result ".concat(t)},"".concat(r,": ").concat(e.what)),i)}))),null===I?null:I instanceof MediaStream?a.a.createElement(p,{stream:I}):a.a.createElement(v,{error:I}),a.a.createElement(d,{hide:!0},a.a.createElement(m,{content:navigator.mediaDevices.getSupportedConstraints()})))},D=a.a.createContext(void 0),w=function(){var e=Object(r.useContext)(D);if(void 0===e)throw new Error("Context not available in component tree parents");return e.recordingDirector},x=function(e){var t=w(),n=Object(r.useState)({stream:null,streamError:"none"}),a=Object(u.a)(n,2),c=a[0],i=a[1];return Object(r.useEffect)((function(){if(void 0!==e){var n=t.videoStreamSubscriptionFor(e);return n.onDeviceRemoved((function(){n.cancel(),i({stream:null,streamError:"DeviceRemoved"})})),n.stream.then((function(e){return i((function(){return{stream:e,streamError:"none"}}))})).catch((function(){return i((function(){return{stream:null,streamError:"CouldNotOpen"}}))})),function(){n.cancel(),i((function(){return{stream:null,streamError:"none"}}))}}}),[t,e]),c},I=function(){var e=Object(r.useState)(void 0),t=Object(u.a)(e,2),n=t[0],c=t[1],i=w();Object(r.useEffect)((function(){var e=function(e){c((function(){return e}))};return i.addOnCameraSelectionChanged(e),function(){i.removeOnCameraSelectionChanged(e)}}),[i]);var o=x(n),s=o.stream,l=o.streamError;if(void 0===n)return a.a.createElement("div",null,"No device selected");if("none"!==l)return a.a.createElement("div",null,l);if(null===s)return a.a.createElement("div",null,"Opening stream");return a.a.createElement("div",null,a.a.createElement(h,{srcObject:s,autoPlay:!0,onClick:function(){i.clearCameraSelection()}}),a.a.createElement("div",null,s.id))},L=n(3),R=function(e){var t,n=e.recordingDirector,r=e.device,c=e.index,i=x(r),u=i.stream,o=i.streamError,s="none"===o;return a.a.createElement("div",null,a.a.createElement("h4",null,"Camera ",c),a.a.createElement("ul",null,a.a.createElement("li",null,"device label: ",r.label),a.a.createElement("li",null,"device id: ",r.deviceId),a.a.createElement("li",null,"group id: ",r.groupId),a.a.createElement("li",null,"stream id: ",null!==(t=null===u||void 0===u?void 0:u.id)&&void 0!==t?t:"no-stream")),!s&&a.a.createElement("div",null,o),s&&a.a.createElement(h,{onClick:function(){n.selectCamera(r)},width:150,srcObject:u,autoPlay:!0}))},P=function(){var e=w(),t=Object(r.useState)({showPreviews:!1,forceReRender:0}),n=Object(u.a)(t,2),c=n[0].showPreviews,i=n[1];Object(r.useEffect)((function(){var t=function(){i((function(e){return Object(L.a)(Object(L.a)({},e),{},{forceReRender:e.forceReRender+1})}))};return e.addOnUpdateDevicesListener(t),function(){e.removeOnUpdateDevicesListener(t)}}),[e]);var o=c?a.a.createElement("button",{onClick:function(){return i((function(e){return Object(L.a)(Object(L.a)({},e),{},{showPreviews:!1})}))}},"Hide Previews"):a.a.createElement("button",{onClick:function(){return i((function(e){return Object(L.a)(Object(L.a)({},e),{},{showPreviews:!0})}))}},"Show Previews"),s=c?e.cameras().map((function(t,n){return a.a.createElement(R,{key:t.deviceId,index:n,device:t,recordingDirector:e})})):null;return a.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},o,s)},F=n(12),U=n(7),_=n(8),M=n(11),B=function(){},T=function(){function e(t,n){Object(U.a)(this,e),this.recordingDirector=t,this.subscriptionDetails=n,this._onDeviceRemoved=function(){},this._canceled=!1,this._deviceRemoved=!1}return Object(_.a)(e,[{key:"onDeviceRemoved",value:function(e){this._onDeviceRemoved=e}},{key:"deviceRemoved",value:function(){this._deviceRemoved=!0,this._onDeviceRemoved()}},{key:"cancel",value:function(){this.recordingDirector.cancelSubscription(this.subscriptionDetails),this._canceled=!0}},{key:"stream",get:function(){return this._canceled||this._deviceRemoved?Promise.reject("subscription canceled"):this.subscriptionDetails.stream}}]),e}(),J=function(){function e(){Object(U.a)(this,e),this.subscriptionsByDevice=new Map}return Object(_.a)(e,[{key:"addSubscriber",value:function(e){var t=e.subscriptionDetails;(function(e,t,n){var r=e.get(t);if(void 0!==r)return r;var a=n(t);return e.set(t,a),a})(this.subscriptionsByDevice,t.deviceIdentifier,(function(){return{stream:e.stream,subscriptions:new Map}})).subscriptions.set(t.subscriptionIdentifier,e)}},{key:"subscriptionsTo",value:function(e){return Array.from(this.subscriptionsByDevice.entries()).filter((function(t){var n=Object(u.a)(t,2),r=n[0];n[1];return e.includes(r)})).map((function(e){var t=Object(u.a)(e,2),n=(t[0],t[1]);return Array.from(n.subscriptions.values())})).reduce((function(e,t){return e.concat(t)}),[])}},{key:"removeSubscriber",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:B,n=this.subscriptionsByDevice.get(e.deviceIdentifier);void 0!==n&&(n.subscriptions.delete(e.subscriptionIdentifier),0===n.subscriptions.size&&(this.subscriptionsByDevice.delete(e.deviceIdentifier),t(n.stream)))}},{key:"streamFor",value:function(e){var t=this.subscriptionsByDevice.get(e.deviceId);if(void 0!==t)return t.stream}}]),e}(),N=function(){function e(){Object(U.a)(this,e),this.onUpdateDevicesListeners=new Set,this.subscriptionLedger=new J,this.devices=[],this.onCameraSelectionChangedListeners=new Set,this.selectedCamera=void 0}return Object(_.a)(e,[{key:"updateDevices",value:function(e){var t,n=e.map((function(e){return e.deviceId})),r=this.devices.filter((function(e){return!n.includes(e.deviceId)})).map((function(e){return e.deviceId}));this.devices.splice(0,this.devices.length),(t=this.devices).push.apply(t,Object(F.a)(e)),this.onUpdateDevicesListeners.forEach((function(e){return e()})),this.subscriptionLedger.subscriptionsTo(r).forEach((function(e){return e.deviceRemoved()}))}},{key:"cameras",value:function(){return this.devices.filter((function(e){return"videoinput"===e.kind})).filter((function(e){return"default"!==e.label}))}},{key:"videoStreamSubscriptionFor",value:function(e){var t={deviceIdentifier:e.deviceId,stream:this.streamForDevice(e),subscriptionIdentifier:Object(M.uuid)()},n=new T(this,t);return this.subscriptionLedger.addSubscriber(n),n}},{key:"cancelSubscription",value:function(e){var t=this;this.subscriptionLedger.removeSubscriber(e,(function(e){return e.then(t.close).catch(B)}))}},{key:"streamForDevice",value:function(e){var t=this,n=this.subscriptionLedger.streamFor(e);return void 0!==n?n:this.videoStreamFor(e).then((function(n){return""===e.label&&navigator.mediaDevices.enumerateDevices().then((function(e){var n=e.map((function(e){return{kind:e.kind,label:e.label,deviceId:e.deviceId,groupId:e.groupId}}));console.log(n),t.updateDevices(n)})),n}))}},{key:"videoStreamFor",value:function(e){return navigator.mediaDevices.getUserMedia({video:{deviceId:e.deviceId}})}},{key:"selectCamera",value:function(e){var t=this;void 0!==this.selectedCamera&&this.selectedCamera.kind===e.kind&&this.selectedCamera.groupId===e.groupId&&this.selectedCamera.deviceId===e.deviceId?console.log("already selected"):(this.selectedCamera=e,this.onCameraSelectionChangedListeners.forEach((function(e){return e(t.selectedCamera)})))}},{key:"clearCameraSelection",value:function(){var e=this;void 0!==this.selectedCamera&&(this.selectedCamera=void 0,this.onCameraSelectionChangedListeners.forEach((function(t){return t(e.selectedCamera)})))}},{key:"addOnUpdateDevicesListener",value:function(e){this.onUpdateDevicesListeners.add(e)}},{key:"removeOnUpdateDevicesListener",value:function(e){this.onUpdateDevicesListeners.delete(e)}},{key:"addOnCameraSelectionChanged",value:function(e){this.onCameraSelectionChangedListeners.add(e),e(this.selectedCamera)}},{key:"removeOnCameraSelectionChanged",value:function(e){this.onCameraSelectionChangedListeners.delete(e)}},{key:"close",value:function(e){e&&e.getTracks().forEach((function(e){return e.stop()}))}}]),e}(),A=function(){navigator.mediaDevices.enumerateDevices().then((function(e){console.log("there are ".concat(e.length," devices"));var t=e.map((function(e){return"".concat(e.kind," ").concat(e.label," (").concat(e.groupId,":").concat(e.deviceId,")")})).join("\n");console.log(t)})).catch((function(e){return console.log(e)}))},q=function(){var e=Object(r.useState)(!0),t=Object(u.a)(e,2),n=t[0],c=t[1];return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{display:"flex"}},a.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},a.a.createElement("button",{onClick:A},"log device information"),a.a.createElement("button",{onClick:function(){return c((function(e){return!e}))}},"toggle camera picker"),n&&a.a.createElement(P,null)),a.a.createElement(I,null)))},z=function(){var e=new N,t=function(){return function(e){navigator.mediaDevices.enumerateDevices().then((function(t){e.updateDevices(t.map((function(e){return{groupId:e.groupId,deviceId:e.deviceId,label:e.label,kind:e.kind}})))})).catch((function(e){console.log(e.name+": "+e.message)}))}(e)};return t(),navigator.mediaDevices.addEventListener("devicechange",t),function(){return a.a.createElement(D.Provider,{value:{recordingDirector:e}},a.a.createElement(q,null),a.a.createElement(S,null))}}();i.a.render(a.a.createElement("div",null,a.a.createElement(z,null)),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.4709a79a.chunk.js.map
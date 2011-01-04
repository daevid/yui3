YUI.add("resize-base",function(E){var AW=E.Lang,m=AW.isArray,u=AW.isBoolean,AU=AW.isNumber,W=AW.isString,A=AW.trim,f=E.Array.indexOf,k=".",e=",",C=" ",V="{handle}",i="active",AG="activeHandle",P="activeHandleNode",AL="all",n="autoHide",r="bottom",F="className",X="defMinHeight",AV="defMinWidth",AT="handle",G="handles",AK="hidden",t="inner",l="left",AE="margin",AR="node",AI="nodeName",z="none",AC="offsetHeight",AF="offsetWidth",a="parentNode",AB="position",Z="relative",AS="resize",AD="resizing",AO="right",b="static",w="top",M="wrap",AQ="wrapper",U="wrapTypes",p="resize:mouseUp",d="resize:resize",g="resize:align",y="resize:end",D="resize:start",H="t",AA="tr",I="r",s="br",c="b",x="bl",Q="l",AH="tl",O=function(B){return(B instanceof E.Node);},j=function(B){return AT+B.toUpperCase();},o=function(){return Array.prototype.slice.call(arguments).join(C);},AN=E.cached(function(B){return B.substring(0,1).toUpperCase()+B.substring(1);}),J=E.ClassNameManager.getClassName,AP=J(AS),v=J(AS,AT),K=J(AS,AT,i),S=J(AS,AT,t),q=J(AS,AT,t,V),N=J(AS,AT,V),h=J(AS,AK,G),AM=J(AS,AQ);function AJ(){AJ.superclass.constructor.apply(this,arguments);}E.mix(AJ,{NAME:AS,ATTRS:{activeHandle:{value:null,validator:function(B){return E.Lang.isString(B)||E.Lang.isNull(B);}},activeHandleNode:{value:null,validator:O},autoHide:{value:false,validator:u},defMinHeight:{value:15,validator:AU},defMinWidth:{value:15,validator:AU},handles:{setter:"_setHandles",value:AL},node:{setter:E.one},resizing:{value:false,validator:u},wrap:{setter:"_setWrap",value:false,validator:u},wrapTypes:{readOnly:true,value:/^canvas|textarea|input|select|button|img|iframe|table|embed$/i},wrapper:{readOnly:true,valueFn:"_valueWrapper",writeOnce:true}},RULES:{b:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.offsetHeight=T.offsetHeight+L;},l:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.left=T.left+R;Y.offsetWidth=T.offsetWidth-R;},r:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.offsetWidth=T.offsetWidth+R;},t:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.top=T.top+L;Y.offsetHeight=T.offsetHeight-L;},tr:function(B,R,L){this.t.apply(this,arguments);this.r.apply(this,arguments);},bl:function(B,R,L){this.b.apply(this,arguments);this.l.apply(this,arguments);},br:function(B,R,L){this.b.apply(this,arguments);this.r.apply(this,arguments);},tl:function(B,R,L){this.t.apply(this,arguments);this.l.apply(this,arguments);}}});E.Resize=E.extend(AJ,E.Base,{ALL_HANDLES:[H,AA,I,s,c,x,Q,AH],REGEX_CHANGE_HEIGHT:/^(t|tr|b|bl|br|tl)$/i,REGEX_CHANGE_LEFT:/^(tl|l|bl)$/i,REGEX_CHANGE_TOP:/^(tl|t|tr)$/i,REGEX_CHANGE_WIDTH:/^(bl|br|l|r|tl|tr)$/i,WRAP_TEMPLATE:'<div class="'+AM+'"></div>',HANDLE_TEMPLATE:'<div class="'+o(v,N)+'">'+'<div class="'+o(S,q)+'">&nbsp;</div>'+"</div>",changeHeightHandles:false,changeLeftHandles:false,changeTopHandles:false,changeWidthHandles:false,delegate:null,info:null,lastInfo:null,originalInfo:null,initializer:function(){var B=this;B.info={};B.originalInfo={};B.get(AR).addClass(AP);B.renderer();},renderUI:function(){var B=this;B._renderHandles();},bindUI:function(){var B=this;B._createEvents();B._bindDD();B._bindHandle();},syncUI:function(){var B=this;B._setHideHandlesUI(B.get(n));},destructor:function(){var B=this,R=B.get(AR),T=B.get(AQ),L=T.get(a);E.Event.purgeElement(T,true);B.eachHandle(function(Y){B.delegate.dd.destroy();Y.remove(true);});if(B.get(M)){B._copyStyles(T,R);if(L){L.insertBefore(R,T);}T.remove(true);}R.removeClass(AP);R.removeClass(h);},renderer:function(){this.renderUI();this.bindUI();this.syncUI();},eachHandle:function(L){var B=this;E.each(B.get(G),function(Y,R){var T=B.get(j(Y));L.apply(B,[T,Y,R]);});},_bindDD:function(){var B=this;B.delegate=new E.DD.Delegate({bubbleTargets:B,container:B.get(AQ),dragConfig:{clickPixelThresh:0,clickTimeThresh:0,useShim:true,move:false},nodes:k+v,target:false});B.on("drag:drag",B._handleResizeEvent);B.on("drag:dropmiss",B._handleMouseUpEvent);B.on("drag:end",B._handleResizeEndEvent);B.on("drag:start",B._handleResizeStartEvent);},_bindHandle:function(){var B=this,L=B.get(AQ);L.on("mouseenter",E.bind(B._onWrapperMouseEnter,B));L.on("mouseleave",E.bind(B._onWrapperMouseLeave,B));L.delegate("mouseenter",E.bind(B._onHandleMouseEnter,B),k+v);L.delegate("mouseleave",E.bind(B._onHandleMouseLeave,B),k+v);},_createEvents:function(){var B=this,L=function(R,T){B.publish(R,{defaultFn:T,queuable:false,emitFacade:true,bubbles:true,prefix:AS});};L(D,this._defResizeStartFn);L(d,this._defResizeFn);L(g,this._defResizeAlignFn);L(y,this._defResizeEndFn);L(p,this._defMouseUpFn);},_renderHandles:function(){var B=this,L=B.get(AQ);B.eachHandle(function(R){L.append(R);});},_buildHandle:function(L){var B=this;return E.Node.create(E.substitute(B.HANDLE_TEMPLATE,{handle:L}));},_calcResize:function(){var B=this,T=B.handle,AX=B.info,Y=B.originalInfo,R=AX.actXY[0]-Y.actXY[0],L=AX.actXY[1]-Y.actXY[1];if(T&&E.Resize.RULES[T]){E.Resize.RULES[T](B,R,L);}else{}},_checkSize:function(AX,L){var B=this,Y=B.info,T=B.originalInfo,R=(AX==AC)?w:l;Y[AX]=L;if(((R==l)&&B.changeLeftHandles)||((R==w)&&B.changeTopHandles)){Y[R]=T[R]+T[AX]-L;}},_copyStyles:function(T,Y){var B=T.getStyle(AB).toLowerCase(),L={},R;if(B==b){B=Z;}R={position:B};E.each([w,l],function(AX){L[AX]=Y.getStyle(AX);R[AX]=T.getStyle(AX);});E.each([w,AO,r,l],function(AY){var AX=AE+AN(AY);L[AX]=Y.getStyle(AX);R[AX]=T.getStyle(AX);});Y.setStyles(R);T.setStyles(L);T.setStyles({margin:0});Y.set(AC,T.get(AC));Y.set(AF,T.get(AF));},_extractHandleName:E.cached(function(R){var L=R.get(F),B=L.match(new RegExp(J(AS,AT,"(\\w{1,2})\\b")));return B?B[1]:null;}),_getInfo:function(Y,B){var AX=[0,0],AZ=B.dragEvent.target,AY=Y.getXY(),T=AY[0],R=AY[1],L=Y.get(AC),Aa=Y.get(AF);if(B){AX=(AZ.actXY.length?AZ.actXY:AZ.lastXY);}return{actXY:AX,bottom:(R+L),left:T,offsetHeight:L,offsetWidth:Aa,right:(T+Aa),top:R};},_setOffset:function(R,L,B){R.set(AF,L);R.set(AC,B);},_syncUI:function(){var B=this,R=B.info,T=B.get(AQ),L=B.get(AR);B._setOffset(T,R.offsetWidth,R.offsetHeight);if(B.changeLeftHandles||B.changeTopHandles){T.setXY([R.left,R.top]);
}if(!T.compareTo(L)){B._setOffset(L,R.offsetWidth,R.offsetHeight);}if(E.UA.webkit){L.setStyle(AS,z);}},_updateChangeHandleInfo:function(L){var B=this;B.changeHeightHandles=B.REGEX_CHANGE_HEIGHT.test(L);B.changeLeftHandles=B.REGEX_CHANGE_LEFT.test(L);B.changeTopHandles=B.REGEX_CHANGE_TOP.test(L);B.changeWidthHandles=B.REGEX_CHANGE_WIDTH.test(L);},_updateInfo:function(L){var B=this;B.info=B._getInfo(B.get(AQ),L);},_setActiveHandlesUI:function(R){var B=this,L=B.get(P);if(L){if(R){B.eachHandle(function(T){T.removeClass(K);});L.addClass(K);}else{L.removeClass(K);}}},_setHandles:function(R){var B=this,L=[];if(m(R)){L=R;}else{if(W(R)){if(R.toLowerCase()==AL){L=B.ALL_HANDLES;}else{E.each(R.split(e),function(Y,T){var AX=A(Y);if(f(B.ALL_HANDLES,AX)>-1){L.push(AX);}});}}}return L;},_setHideHandlesUI:function(L){var B=this,R=B.get(AQ);if(!B.get(AD)){if(L){R.addClass(h);}else{R.removeClass(h);}}},_setWrap:function(T){var B=this,R=B.get(AR),Y=R.get(AI),L=B.get(U);if(L.test(Y)){T=true;}return T;},_defMouseUpFn:function(L){var B=this;B.set(AD,false);},_defResizeFn:function(L){var B=this;B._resize(L);},_resize:function(L){var B=this;B._handleResizeAlignEvent(L.dragEvent);B._syncUI();},_defResizeAlignFn:function(L){var B=this;B._resizeAlign(L);},_resizeAlign:function(R){var B=this,T,L,Y;B.lastInfo=B.info;B._updateInfo(R);T=B.info;B._calcResize();if(!B.con){L=B.get(X);Y=B.get(AV);if(T.offsetHeight<=L){B._checkSize(AC,L);}if(T.offsetWidth<=Y){B._checkSize(AF,Y);}}},_defResizeEndFn:function(L){var B=this;B._resizeEnd(L);},_resizeEnd:function(R){var B=this,L=R.dragEvent.target;L.actXY=[];B._syncUI();B._setActiveHandlesUI(false);B.set(AG,null);B.set(P,null);B.handle=null;},_defResizeStartFn:function(L){var B=this;B._resizeStart(L);},_resizeStart:function(L){var B=this,R=B.get(AQ);B.handle=B.get(AG);B.set(AD,true);B.originalInfo=B._getInfo(R,L);B._updateInfo(L);},_handleMouseUpEvent:function(B){this.fire(p,{dragEvent:B,info:this.info});},_handleResizeEvent:function(B){this.fire(d,{dragEvent:B,info:this.info});},_handleResizeAlignEvent:function(B){this.fire(g,{dragEvent:B,info:this.info});},_handleResizeEndEvent:function(B){this.fire(y,{dragEvent:B,info:this.info});},_handleResizeStartEvent:function(B){if(!this.get(AG)){this._setHandleFromNode(B.target.get("node"));}this.fire(D,{dragEvent:B,info:this.info});},_onWrapperMouseEnter:function(L){var B=this;if(B.get(n)){B._setHideHandlesUI(false);}},_onWrapperMouseLeave:function(L){var B=this;if(B.get(n)){B._setHideHandlesUI(true);}},_setHandleFromNode:function(L){var B=this,R=B._extractHandleName(L);if(!B.get(AD)){B.set(AG,R);B.set(P,L);B._setActiveHandlesUI(true);B._updateChangeHandleInfo(R);}},_onHandleMouseEnter:function(B){this._setHandleFromNode(B.currentTarget);},_onHandleMouseLeave:function(L){var B=this;if(!B.get(AD)){B._setActiveHandlesUI(false);}},_valueWrapper:function(){var B=this,R=B.get(AR),L=R.get(a),T=R;if(B.get(M)){T=E.Node.create(B.WRAP_TEMPLATE);if(L){L.insertBefore(T,R);}T.append(R);B._copyStyles(R,T);R.setStyles({position:b,left:0,top:0});}return T;}});E.each(E.Resize.prototype.ALL_HANDLES,function(L,B){E.Resize.ATTRS[j(L)]={setter:function(){return this._buildHandle(L);},value:null,writeOnce:true};});},"@VERSION@",{requires:["base","widget","substitute","event","oop","dd-drag","dd-delegate","dd-drop"],skinnable:true});YUI.add("resize-proxy",function(C){var N="activeHandleNode",I="cursor",G="dragCursor",L="host",K="parentNode",F="proxy",D="proxyNode",B="resize",A="resize-proxy",J="wrapper",E=C.ClassNameManager.getClassName,M=E(B,F);function H(){H.superclass.constructor.apply(this,arguments);}C.mix(H,{NAME:A,NS:F,ATTRS:{proxyNode:{setter:C.one,valueFn:function(){return C.Node.create(this.PROXY_TEMPLATE);}}}});C.extend(H,C.Plugin.Base,{PROXY_TEMPLATE:'<div class="'+M+'"></div>',initializer:function(){var O=this;O.afterHostEvent("resize:start",O._afterResizeStart);O.beforeHostMethod("_resize",O._beforeHostResize);O.afterHostMethod("_resizeEnd",O._afterHostResizeEnd);},destructor:function(){var O=this;O.get(D).remove(true);},_afterHostResizeEnd:function(Q){var O=this,P=Q.dragEvent.target;P.actXY=[];O._syncProxyUI();O.get(D).hide();},_afterResizeStart:function(P){var O=this;O._renderProxy();},_beforeHostResize:function(Q){var O=this,P=this.get(L);P._handleResizeAlignEvent(Q.dragEvent);O._syncProxyUI();return new C.Do.Prevent();},_renderProxy:function(){var O=this,Q=this.get(L),P=O.get(D);if(!P.inDoc()){Q.get(J).get(K).append(P.hide());}},_syncProxyUI:function(){var O=this,Q=this.get(L),S=Q.info,R=Q.get(N),P=O.get(D),T=R.getStyle(I);P.show().setStyle(I,T);Q.delegate.dd.set(G,T);Q._setOffset(P,S.offsetWidth,S.offsetHeight);P.setXY([S.left,S.top]);}});C.namespace("Plugin");C.Plugin.ResizeProxy=H;},"@VERSION@",{requires:["resize-base","plugin"],skinnable:false});YUI.add("resize-constrain",function(C){var J=C.Lang,P=J.isBoolean,T=J.isNumber,R=J.isString,a=function(Y){return(Y instanceof C.Node);},d="borderBottomWidth",G="borderLeftWidth",Z="borderRightWidth",K="borderTopWidth",N="bottom",M="con",e="constrain",f="host",S="left",I="maxHeight",V="maxWidth",A="minHeight",L="minWidth",g="node",B="offsetHeight",O="offsetWidth",E="preserveRatio",X="region",U="resizeConstrained",Q="right",F="tickX",D="tickY",W="top",c="view",b="viewportRegion";function H(){H.superclass.constructor.apply(this,arguments);}C.mix(H,{NAME:U,NS:M,ATTRS:{constrain:{setter:function(Y){if(Y&&(a(Y)||R(Y)||Y.nodeType)){Y=C.one(Y);}return Y;}},minHeight:{value:15,validator:T},minWidth:{value:15,validator:T},maxHeight:{value:Infinity,validator:T},maxWidth:{value:Infinity,validator:T},preserveRatio:{value:false,validator:P},tickX:{value:false},tickY:{value:false}}});C.extend(H,C.Plugin.Base,{constrainBorderInfo:null,initializer:function(){var Y=this,h=Y.get(f);Y.constrainBorderInfo={bottom:0,left:0,right:0,top:0};h.delegate.dd.plug(C.Plugin.DDConstrained,{tickX:Y.get(F),tickY:Y.get(D)});h.after("resize:align",C.bind(Y._handleResizeAlignEvent,Y));h.on("resize:start",C.bind(Y._handleResizeStartEvent,Y));
},_checkConstrain:function(h,q,i){var n=this,m,j,k,p,o=n.get(f),Y=o.info,l=n._getConstrainRegion();if(l){m=Y[h]+Y[i];j=l[q]-n.constrainBorderInfo[q];if(m>=j){Y[i]-=(m-j);}k=Y[h];p=l[h]+n.constrainBorderInfo[h];if(k<=p){Y[h]+=(p-k);Y[i]-=(p-k);}}},_checkHeight:function(){var Y=this,i=Y.get(f),k=i.info,h=Y.get(I),j=Y.get(A);Y._checkConstrain(W,N,B);if(k.offsetHeight>h){i._checkSize(B,h);}if(k.offsetHeight<j){i._checkSize(B,j);}},_checkRatio:function(){var u=this,n=u.get(f),t=n.info,j=n.originalInfo,m=j.offsetWidth,v=j.offsetHeight,l=j.top,w=j.left,p=j.bottom,s=j.right,i=function(){return(t.offsetWidth/m);},k=function(){return(t.offsetHeight/v);},o=n.changeHeightHandles,Y,x,q,r,h,y;if(u.get(e)&&n.changeHeightHandles&&n.changeWidthHandles){q=u._getConstrainRegion();x=u.constrainBorderInfo;Y=(q.bottom-x.bottom)-p;r=w-(q.left+x.left);h=(q.right-x.right)-s;y=l-(q.top+x.top);if(n.changeLeftHandles&&n.changeTopHandles){o=(y<r);}else{if(n.changeLeftHandles){o=(Y<r);}else{if(n.changeTopHandles){o=(y<h);}else{o=(Y<h);}}}}if(o){t.offsetWidth=m*k();u._checkWidth();t.offsetHeight=v*i();}else{t.offsetHeight=v*i();u._checkHeight();t.offsetWidth=m*k();}if(n.changeTopHandles){t.top=l+(v-t.offsetHeight);}if(n.changeLeftHandles){t.left=w+(m-t.offsetWidth);}C.each(t,function(AA,z){if(T(AA)){t[z]=Math.round(AA);}});},_checkRegion:function(){var Y=this,h=Y.get(f),i=Y._getConstrainRegion();return C.DOM.inRegion(null,i,true,h.info);},_checkWidth:function(){var Y=this,j=Y.get(f),k=j.info,i=Y.get(V),h=Y.get(L);Y._checkConstrain(S,Q,O);if(k.offsetWidth<h){j._checkSize(O,h);}if(k.offsetWidth>i){j._checkSize(O,i);}},_getConstrainRegion:function(){var Y=this,i=Y.get(f),h=i.get(g),k=Y.get(e),j=null;if(k){if(k==c){j=h.get(b);}else{if(a(k)){j=k.get(X);}else{j=k;}}}return j;},_handleResizeAlignEvent:function(i){var Y=this,h=Y.get(f);Y._checkHeight();Y._checkWidth();if(Y.get(E)){Y._checkRatio();}if(Y.get(e)&&!Y._checkRegion()){h.info=h.lastInfo;}},_handleResizeStartEvent:function(h){var Y=this;Y._updateConstrainBorderInfo();},_updateConstrainBorderInfo:function(){var h=this,i=h.get(e),Y;if(a(i)){Y=function(j){return parseFloat(i.getStyle(j))||0;};h.constrainBorderInfo.bottom=Y(d);h.constrainBorderInfo.left=Y(G);h.constrainBorderInfo.right=Y(Z);h.constrainBorderInfo.top=Y(K);}}});C.namespace("Plugin");C.Plugin.ResizeConstrained=H;},"@VERSION@",{requires:["resize-base","plugin"],skinnable:false});YUI.add("resize",function(A){},"@VERSION@",{use:["resize-base","resize-proxy","resize-constrain"]});
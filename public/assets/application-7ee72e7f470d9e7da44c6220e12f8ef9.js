(function(){var n,t,e,r,o,i,u,a,c,l,s,f,d,p,h,v,m,g,y,w,b,_,x,A,k,E,$,S,j,O,R,T,M,N,q,C,G,I,F,H,D,X,L,B,P,z={}.hasOwnProperty,K=[].indexOf||function(n){for(var t=0,e=this.length;e>t;t++)if(t in this&&this[t]===n)return t;return-1};u=10,f=null,R=null,_=null,E={},l=null,I=(null!=(P=document.cookie.match(/request_method=(\w+)/))?P[1].toUpperCase():void 0)||"",B=null,m=function(n){var t;return X("page:fetch"),t=C(n),null!=B&&B.abort(),B=new XMLHttpRequest,B.open("GET",t,!0),B.setRequestHeader("Accept","text/html, application/xhtml+xml, application/xml"),B.setRequestHeader("X-XHR-Referer",R),B.onload=function(){var t;return X("page:receive"),(t=j())?(T(n),a.apply(null,h(t)),M(),document.location.hash?document.location.href=document.location.href:H(),X("page:load")):document.location.href=n},B.onloadend=function(){return B=null},B.onabort=function(){return q()},B.onerror=function(){return document.location.href=n},B.send()},v=function(n){var t;return i(),t=E[n],null!=B&&B.abort(),a(t.title,t.body),O(t),X("page:restore")},i=function(){return E[f.position]={url:document.location.href,body:document.body,title:document.title,positionY:window.pageYOffset,positionX:window.pageXOffset},c(u)},S=function(n){return null==n&&(n=u),/^[\d]+$/.test(n)?u=parseInt(n):void 0},c=function(n){var t,e;for(t in E)z.call(E,t)&&(e=E[t],t<=f.position-n&&(E[t]=null))},a=function(t,e,r,o){return document.title=t,document.documentElement.replaceChild(e,document.body),null!=r&&n.update(r),G(),o&&d(),f=window.history.state,X("page:change")},d=function(){var n,t,e,r,o,i,u,a,c,l,s,f;for(i=Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])')),u=0,c=i.length;c>u;u++)if(o=i[u],""===(s=o.type)||"text/javascript"===s){for(t=document.createElement("script"),f=o.attributes,a=0,l=f.length;l>a;a++)n=f[a],t.setAttribute(n.name,n.value);t.appendChild(document.createTextNode(o.innerHTML)),r=o.parentNode,e=o.nextSibling,r.removeChild(o),r.insertBefore(t,e)}},G=function(){var n,t,e,r;for(t=Array.prototype.slice.call(document.body.getElementsByTagName("noscript")),e=0,r=t.length;r>e;e++)n=t[e],n.parentNode.removeChild(n)},T=function(n){return n!==R?window.history.pushState({turbolinks:!0,position:f.position+1},"",n):void 0},M=function(){var n,t;return(n=B.getResponseHeader("X-XHR-Redirected-To"))?(t=C(n)===n?document.location.hash:"",window.history.replaceState(f,"",n+t)):void 0},q=function(){return window.history.replaceState({turbolinks:!0,position:Date.now()},"",document.location.href)},N=function(){return f=window.history.state},O=function(n){return window.scrollTo(n.positionX,n.positionY)},H=function(){return window.scrollTo(0,0)},C=function(n){var t;return t=n,null==n.href&&(t=document.createElement("A"),t.href=n),t.href.replace(t.hash,"")},X=function(n){var t;return t=document.createEvent("Events"),t.initEvent(n,!0,!0),document.dispatchEvent(t)},$=function(){return!X("page:before-change")},j=function(){var n,t,e,r,o,i;return t=function(){var n;return 400<=(n=B.status)&&600>n},i=function(){return B.getResponseHeader("Content-Type").match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)},r=function(n){var t,e,r,o,i;for(o=n.head.childNodes,i=[],e=0,r=o.length;r>e;e++)t=o[e],null!=("function"==typeof t.getAttribute?t.getAttribute("data-turbolinks-track"):void 0)&&i.push(t.getAttribute("src")||t.getAttribute("href"));return i},n=function(n){var t;return _||(_=r(document)),t=r(n),t.length!==_.length||o(t,_).length!==_.length},o=function(n,t){var e,r,o,i,u;for(n.length>t.length&&(i=[t,n],n=i[0],t=i[1]),u=[],r=0,o=n.length;o>r;r++)e=n[r],K.call(t,e)>=0&&u.push(e);return u},!t()&&i()&&(e=l(B.responseText),e&&!n(e))?e:void 0},h=function(t){var e;return e=t.querySelector("title"),[null!=e?e.textContent:void 0,t.body,n.get(t).token,"runScripts"]},n={get:function(n){var t;return null==n&&(n=document),{node:t=n.querySelector('meta[name="csrf-token"]'),token:null!=t?"function"==typeof t.getAttribute?t.getAttribute("content"):void 0:void 0}},update:function(n){var t;return t=this.get(),null!=t.token&&null!=n&&t.token!==n?t.node.setAttribute("content",n):void 0}},e=function(){var n,t,e,r,o,i;t=function(n){return(new DOMParser).parseFromString(n,"text/html")},n=function(n){var t;return t=document.implementation.createHTMLDocument(""),t.documentElement.innerHTML=n,t},e=function(n){var t;return t=document.implementation.createHTMLDocument(""),t.open("replace"),t.write(n),t.close(),t};try{if(window.DOMParser)return o=t("<html><body><p>test"),t}catch(u){return r=u,o=n("<html><body><p>test"),n}finally{if(1!==(null!=o?null!=(i=o.body)?i.childNodes.length:void 0:void 0))return e}},b=function(n){return n.defaultPrevented?void 0:(document.removeEventListener("click",g,!1),document.addEventListener("click",g,!1))},g=function(n){var t;return n.defaultPrevented||(t=p(n),"A"!==t.nodeName||y(n,t))?void 0:($()||L(t.href),n.preventDefault())},p=function(n){var t;for(t=n.target;t.parentNode&&"A"!==t.nodeName;)t=t.parentNode;return t},s=function(n){return location.protocol!==n.protocol||location.host!==n.host},t=function(n){return(n.hash&&C(n))===C(location)||n.href===location.href+"#"},A=function(n){var t;return t=C(n),t.match(/\.[a-z]+(\?.*)?$/g)&&!t.match(/\.html?(\?.*)?$/g)},x=function(n){for(var t;!t&&n!==document;)t=null!=n.getAttribute("data-no-turbolink"),n=n.parentNode;return t},D=function(n){return 0!==n.target.length},k=function(n){return n.which>1||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey},y=function(n,e){return s(e)||t(e)||A(e)||x(e)||D(e)||k(n)},w=function(){return q(),N(),l=e(),document.addEventListener("click",b,!0),window.addEventListener("popstate",function(n){var t;return t=n.state,(null!=t?t.turbolinks:void 0)?E[t.position]?v(t.position):L(n.target.location.href):void 0},!1)},o=window.history&&window.history.pushState&&window.history.replaceState&&void 0!==window.history.state,r=!navigator.userAgent.match(/CriOS\//),F="GET"===I||""===I,o&&r&&F?(L=function(n){return R=document.location.href,i(),m(n)},w()):L=function(n){return document.location.href=n},this.Turbolinks={visit:L,pagesCached:S}}).call(this),$(document).ready(function(){function n(){d=!1}function t(){d=!0}function e(n){for(var t=0;n>t;t++){s[t]=new Array(n),$(".board").append("<div class='row'id='row"+t+"'>");for(var e=0;n>e;e++){var r=$("<div class='square'><div/>");r.data({coord:[t,e]}),$("#row"+t).append(r),s[t][e]=r}$(".board").append("</div>")}var o=Math.min(.7*$(window).height(),.7*$(window).width());$(".square").width(o/n),$(".square").height($(".square").width())}var r,o,i;i=$(window);var u=!0,a=$(".board"),c=$(".outer");c.data({rows:a.attr("id")});var l,s,f,d=!0,p='<div class="loader"> <div class="spinner-holder"></div></div>',h='<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>';Server=function(){};var v=new Server,m=function(){if(1==d){$this=$(this),coord=$this.data("coord"),console.log(coord);{x()}1==S(coord)&&(v.sendHumanMove({coord:coord}),n())}};$(".title-cont").on("click",function(){A()}),$(window).attr("unselectable","on").css("user-select","none").css("MozUserSelect","none").on("selectstart",!1);var g=!1,y=10,w=0,b=$(".slide-left"),x=function(){return 0==f.length?!0:!1},A=function(){v.startNewGame(),a.empty(),r=$("<div class='stone black-stone' ></div>"),o=$("<div class='stone white-stone' ></div>"),l=$(".outer").data("rows"),d=!0,s=new Array(l),f=[],e(c.data("rows"))>$(".square").on("click",_.debounce(m,100)),$(".board").append(p)};$(".edit_game").on("submit",function(n){console.log("submit"),v.sendOptions(c.data("game_id"),{test:!1}),n.preventDefault()}),$(".slide-left").on("mousedown",function(n){console.log($(this).attr("class")),w=$(".slide-left").width()-($(window).width()-n.pageX),console.log("ORIG: "+w),g=!0}),$("input[type=text]").on("click",function(){}),i.on("mouseup",function(){g=!1}),i.on("mousemove",_.throttle(function(n){n.preventDefault();var t=i.width()-n.pageX;g&&b.width()<=160&&b.width()>=30?(y=t,b.width(Math.max(Math.min(t+w,160),30))):b.width()>=160&&b.width(160)},50)),i.on("resize",function(){var n=Math.min(.7*i.height(),.7*i.width());$(".square").width(n/l),$(".square").height($(".square").width())}),Server.prototype.getAIMove=function(n,e){$.ajax({url:n,type:"get",async:!0,timeout:99999999,dataType:"json",beforeSend:function(){}}).done(function(){}).fail(function(n){console.log("FAIL"),console.log(n),console.log(JSON.stringify(n.coord)),console.log("FAIL C")}).always(function(n,r,o){window.XMLHttpRequest?(console.log("TEST"),xmlhttp=new XMLHttpRequest,console.log(o.getAllResponseHeaders()),console.log(o)):console.log("WTF?"),console.log("DONE C"),console.log(n),"string"==typeof n&&(console.log("IS A STRING?"),console.log(n)),console.log("TYPE: "+typeof n);try{if(console.log(JSON.stringify(n)),null==n||null==n.coord&&null==n["0"]&&null==n["1"]&&null==n.tie){if(console.log("data null C"),e>30)return console.log("COUNT EXCEEDED 30"),void 0;setTimeout(function(){v.getAIMove("/get_ai_move_retry/",e+1)},1e3*e/4)}else"coord"in n?(console.log("not null C: "+JSON.stringify(n)),n.p2_moves.length>(f.length-1)/2?(coord=n.coord,E(coord),t(),R()):(console.log("RETURNED WRONG MOVE, KEEP CHECKING"),v.getAIMove("/get_ai_move_retry/",e+1))):"0"in n?j(n["0"]):"1"in n?(coord=n.winCoord,E(coord),j(n["1"])):"tie"in n&&O()}catch(i){i instanceof TypeError&&(console.log("***ERROR***"),v.getAIMove("/get_ai_move_retry/",e+1))}})};var k=function(n,t){s[n[0]][n[1]].append(t),f.push(t)},E=function(n){console.log("COORD: "+n),k(n,o.clone()),s[n[0]][n[1]].children(".white-stone").hide().fadeIn("slow")},S=function(n){return s[n[0]][n[1]].children(".stone").length>0?!1:(k(n,r.clone()),!0)},j=function(n){for(var t=0;t<n.length;t++)s[n[t][0]][n[t][1]].children().addClass("highlight");R()},O=function(){R()},R=function(){u=!1,$(".spinner-holder").empty(),$(".loader").fadeOut()};Server.prototype.startNewGame=function(){$.ajax({url:"/games/new/",type:"get",async:!0,dataType:"json",beforeSend:function(n){n.setRequestHeader("Accept","application/json"),n.setRequestHeader("X-CSRF-Token",$('meta[name="csrf-token"]').attr("content"))}}).done(function(n){console.log(n),c.data({rows:n.rows,win_chain:n.win_chain,game_id:n.game_id})}).fail(function(){}).always(function(){})},Server.prototype.sendHumanMove=function(n){options=n||{},$.ajax({url:"/send_human_move/",type:"post",async:!0,data:$.param(options),dataType:"script",beforeSend:function(n){u=!0,setTimeout(function(){1==u&&($(".spinner-holder").append(h),$(".loader").fadeIn("slow"))},300),n.setRequestHeader("X-CSRF-Token",$('meta[name="csrf-token"]').attr("content"))}}).done(function(){v.getAIMove("/get_ai_move/",0)}).fail(function(){}).always(function(){})},Server.prototype.sendOptions=function(n,t){options=t||{},send_data=$(".edit_game").serialize(),$.ajax({url:"/games/"+n+"/update",type:"put",async:!1,data:send_data,dataType:"json",beforeSend:function(n){n.setRequestHeader("Accept","application/json"),n.setRequestHeader("X-CSRF-Token",$('meta[name="csrf-token"]').attr("content"))}}).done(function(){}).fail(function(){}).always(function(n){c.data({rows:n.rows})})},A()}),function(){}.call(this),function(n){n.fn.disableSelection=function(){return this.bind((n.support.selectstart?"selectstart":"mousedown")+".disableSelection",function(n){n.preventDefault()})},n.fn.enableSelection=function(){return this.unbind(".disableSelection")}}(jQuery),function(){}.call(this),function(){var n=this,t=n._,e={},r=Array.prototype,o=Object.prototype,i=Function.prototype,u=r.push,a=r.slice,c=r.concat,l=o.toString,s=o.hasOwnProperty,f=r.forEach,d=r.map,p=r.reduce,h=r.reduceRight,v=r.filter,m=r.every,g=r.some,y=r.indexOf,w=r.lastIndexOf,b=Array.isArray,_=Object.keys,x=i.bind,A=function(n){return n instanceof A?n:this instanceof A?(this._wrapped=n,void 0):new A(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=A),exports._=A):n._=A,A.VERSION="1.5.2";var k=A.each=A.forEach=function(n,t,r){if(null!=n)if(f&&n.forEach===f)n.forEach(t,r);else if(n.length===+n.length){for(var o=0,i=n.length;i>o;o++)if(t.call(r,n[o],o,n)===e)return}else for(var u=A.keys(n),o=0,i=u.length;i>o;o++)if(t.call(r,n[u[o]],u[o],n)===e)return};A.map=A.collect=function(n,t,e){var r=[];return null==n?r:d&&n.map===d?n.map(t,e):(k(n,function(n,o,i){r.push(t.call(e,n,o,i))}),r)};var E="Reduce of empty array with no initial value";A.reduce=A.foldl=A.inject=function(n,t,e,r){var o=arguments.length>2;if(null==n&&(n=[]),p&&n.reduce===p)return r&&(t=A.bind(t,r)),o?n.reduce(t,e):n.reduce(t);if(k(n,function(n,i,u){o?e=t.call(r,e,n,i,u):(e=n,o=!0)}),!o)throw new TypeError(E);return e},A.reduceRight=A.foldr=function(n,t,e,r){var o=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return r&&(t=A.bind(t,r)),o?n.reduceRight(t,e):n.reduceRight(t);var i=n.length;if(i!==+i){var u=A.keys(n);i=u.length}if(k(n,function(a,c,l){c=u?u[--i]:--i,o?e=t.call(r,e,n[c],c,l):(e=n[c],o=!0)}),!o)throw new TypeError(E);return e},A.find=A.detect=function(n,t,e){var r;return $(n,function(n,o,i){return t.call(e,n,o,i)?(r=n,!0):void 0}),r},A.filter=A.select=function(n,t,e){var r=[];return null==n?r:v&&n.filter===v?n.filter(t,e):(k(n,function(n,o,i){t.call(e,n,o,i)&&r.push(n)}),r)},A.reject=function(n,t,e){return A.filter(n,function(n,r,o){return!t.call(e,n,r,o)},e)},A.every=A.all=function(n,t,r){t||(t=A.identity);var o=!0;return null==n?o:m&&n.every===m?n.every(t,r):(k(n,function(n,i,u){return(o=o&&t.call(r,n,i,u))?void 0:e}),!!o)};var $=A.some=A.any=function(n,t,r){t||(t=A.identity);var o=!1;return null==n?o:g&&n.some===g?n.some(t,r):(k(n,function(n,i,u){return o||(o=t.call(r,n,i,u))?e:void 0}),!!o)};A.contains=A.include=function(n,t){return null==n?!1:y&&n.indexOf===y?-1!=n.indexOf(t):$(n,function(n){return n===t})},A.invoke=function(n,t){var e=a.call(arguments,2),r=A.isFunction(t);return A.map(n,function(n){return(r?t:n[t]).apply(n,e)})},A.pluck=function(n,t){return A.map(n,function(n){return n[t]})},A.where=function(n,t,e){return A.isEmpty(t)?e?void 0:[]:A[e?"find":"filter"](n,function(n){for(var e in t)if(t[e]!==n[e])return!1;return!0})},A.findWhere=function(n,t){return A.where(n,t,!0)},A.max=function(n,t,e){if(!t&&A.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&A.isEmpty(n))return-1/0;var r={computed:-1/0,value:-1/0};return k(n,function(n,o,i){var u=t?t.call(e,n,o,i):n;u>r.computed&&(r={value:n,computed:u})}),r.value},A.min=function(n,t,e){if(!t&&A.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&A.isEmpty(n))return 1/0;var r={computed:1/0,value:1/0};return k(n,function(n,o,i){var u=t?t.call(e,n,o,i):n;u<r.computed&&(r={value:n,computed:u})}),r.value},A.shuffle=function(n){var t,e=0,r=[];return k(n,function(n){t=A.random(e++),r[e-1]=r[t],r[t]=n}),r},A.sample=function(n,t,e){return arguments.length<2||e?n[A.random(n.length-1)]:A.shuffle(n).slice(0,Math.max(0,t))};var S=function(n){return A.isFunction(n)?n:function(t){return t[n]}};A.sortBy=function(n,t,e){var r=S(t);return A.pluck(A.map(n,function(n,t,o){return{value:n,index:t,criteria:r.call(e,n,t,o)}}).sort(function(n,t){var e=n.criteria,r=t.criteria;if(e!==r){if(e>r||void 0===e)return 1;if(r>e||void 0===r)return-1}return n.index-t.index}),"value")};var j=function(n){return function(t,e,r){var o={},i=null==e?A.identity:S(e);return k(t,function(e,u){var a=i.call(r,e,u,t);n(o,a,e)}),o}};A.groupBy=j(function(n,t,e){(A.has(n,t)?n[t]:n[t]=[]).push(e)}),A.indexBy=j(function(n,t,e){n[t]=e}),A.countBy=j(function(n,t){A.has(n,t)?n[t]++:n[t]=1}),A.sortedIndex=function(n,t,e,r){e=null==e?A.identity:S(e);for(var o=e.call(r,t),i=0,u=n.length;u>i;){var a=i+u>>>1;e.call(r,n[a])<o?i=a+1:u=a}return i},A.toArray=function(n){return n?A.isArray(n)?a.call(n):n.length===+n.length?A.map(n,A.identity):A.values(n):[]},A.size=function(n){return null==n?0:n.length===+n.length?n.length:A.keys(n).length},A.first=A.head=A.take=function(n,t,e){return null==n?void 0:null==t||e?n[0]:a.call(n,0,t)},A.initial=function(n,t,e){return a.call(n,0,n.length-(null==t||e?1:t))},A.last=function(n,t,e){return null==n?void 0:null==t||e?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},A.rest=A.tail=A.drop=function(n,t,e){return a.call(n,null==t||e?1:t)},A.compact=function(n){return A.filter(n,A.identity)};var O=function(n,t,e){return t&&A.every(n,A.isArray)?c.apply(e,n):(k(n,function(n){A.isArray(n)||A.isArguments(n)?t?u.apply(e,n):O(n,t,e):e.push(n)}),e)};A.flatten=function(n,t){return O(n,t,[])},A.without=function(n){return A.difference(n,a.call(arguments,1))},A.uniq=A.unique=function(n,t,e,r){A.isFunction(t)&&(r=e,e=t,t=!1);var o=e?A.map(n,e,r):n,i=[],u=[];return k(o,function(e,r){(t?r&&u[u.length-1]===e:A.contains(u,e))||(u.push(e),i.push(n[r]))}),i},A.union=function(){return A.uniq(A.flatten(arguments,!0))},A.intersection=function(n){var t=a.call(arguments,1);return A.filter(A.uniq(n),function(n){return A.every(t,function(t){return A.indexOf(t,n)>=0})})},A.difference=function(n){var t=c.apply(r,a.call(arguments,1));return A.filter(n,function(n){return!A.contains(t,n)})},A.zip=function(){for(var n=A.max(A.pluck(arguments,"length").concat(0)),t=new Array(n),e=0;n>e;e++)t[e]=A.pluck(arguments,""+e);return t},A.object=function(n,t){if(null==n)return{};for(var e={},r=0,o=n.length;o>r;r++)t?e[n[r]]=t[r]:e[n[r][0]]=n[r][1];return e},A.indexOf=function(n,t,e){if(null==n)return-1;var r=0,o=n.length;if(e){if("number"!=typeof e)return r=A.sortedIndex(n,t),n[r]===t?r:-1;r=0>e?Math.max(0,o+e):e}if(y&&n.indexOf===y)return n.indexOf(t,e);for(;o>r;r++)if(n[r]===t)return r;return-1},A.lastIndexOf=function(n,t,e){if(null==n)return-1;var r=null!=e;if(w&&n.lastIndexOf===w)return r?n.lastIndexOf(t,e):n.lastIndexOf(t);for(var o=r?e:n.length;o--;)if(n[o]===t)return o;return-1},A.range=function(n,t,e){arguments.length<=1&&(t=n||0,n=0),e=arguments[2]||1;for(var r=Math.max(Math.ceil((t-n)/e),0),o=0,i=new Array(r);r>o;)i[o++]=n,n+=e;return i};var R=function(){};A.bind=function(n,t){var e,r;if(x&&n.bind===x)return x.apply(n,a.call(arguments,1));if(!A.isFunction(n))throw new TypeError;return e=a.call(arguments,2),r=function(){if(!(this instanceof r))return n.apply(t,e.concat(a.call(arguments)));R.prototype=n.prototype;var o=new R;R.prototype=null;var i=n.apply(o,e.concat(a.call(arguments)));return Object(i)===i?i:o}},A.partial=function(n){var t=a.call(arguments,1);return function(){return n.apply(this,t.concat(a.call(arguments)))}},A.bindAll=function(n){var t=a.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return k(t,function(t){n[t]=A.bind(n[t],n)}),n},A.memoize=function(n,t){var e={};return t||(t=A.identity),function(){var r=t.apply(this,arguments);return A.has(e,r)?e[r]:e[r]=n.apply(this,arguments)}},A.delay=function(n,t){var e=a.call(arguments,2);return setTimeout(function(){return n.apply(null,e)},t)},A.defer=function(n){return A.delay.apply(A,[n,1].concat(a.call(arguments,1)))},A.throttle=function(n,t,e){var r,o,i,u=null,a=0;e||(e={});var c=function(){a=e.leading===!1?0:new Date,u=null,i=n.apply(r,o)};return function(){var l=new Date;a||e.leading!==!1||(a=l);var s=t-(l-a);return r=this,o=arguments,0>=s?(clearTimeout(u),u=null,a=l,i=n.apply(r,o)):u||e.trailing===!1||(u=setTimeout(c,s)),i}},A.debounce=function(n,t,e){var r,o,i,u,a;return function(){i=this,o=arguments,u=new Date;var c=function(){var l=new Date-u;t>l?r=setTimeout(c,t-l):(r=null,e||(a=n.apply(i,o)))},l=e&&!r;return r||(r=setTimeout(c,t)),l&&(a=n.apply(i,o)),a}},A.once=function(n){var t,e=!1;return function(){return e?t:(e=!0,t=n.apply(this,arguments),n=null,t)}},A.wrap=function(n,t){return function(){var e=[n];return u.apply(e,arguments),t.apply(this,e)}},A.compose=function(){var n=arguments;return function(){for(var t=arguments,e=n.length-1;e>=0;e--)t=[n[e].apply(this,t)];return t[0]}},A.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},A.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var e in n)A.has(n,e)&&t.push(e);return t},A.values=function(n){for(var t=A.keys(n),e=t.length,r=new Array(e),o=0;e>o;o++)r[o]=n[t[o]];return r},A.pairs=function(n){for(var t=A.keys(n),e=t.length,r=new Array(e),o=0;e>o;o++)r[o]=[t[o],n[t[o]]];return r},A.invert=function(n){for(var t={},e=A.keys(n),r=0,o=e.length;o>r;r++)t[n[e[r]]]=e[r];return t},A.functions=A.methods=function(n){var t=[];for(var e in n)A.isFunction(n[e])&&t.push(e);return t.sort()},A.extend=function(n){return k(a.call(arguments,1),function(t){if(t)for(var e in t)n[e]=t[e]}),n},A.pick=function(n){var t={},e=c.apply(r,a.call(arguments,1));return k(e,function(e){e in n&&(t[e]=n[e])}),t},A.omit=function(n){var t={},e=c.apply(r,a.call(arguments,1));for(var o in n)A.contains(e,o)||(t[o]=n[o]);return t},A.defaults=function(n){return k(a.call(arguments,1),function(t){if(t)for(var e in t)void 0===n[e]&&(n[e]=t[e])}),n},A.clone=function(n){return A.isObject(n)?A.isArray(n)?n.slice():A.extend({},n):n},A.tap=function(n,t){return t(n),n};var T=function(n,t,e,r){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof A&&(n=n._wrapped),t instanceof A&&(t=t._wrapped);var o=l.call(n);if(o!=l.call(t))return!1;switch(o){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=e.length;i--;)if(e[i]==n)return r[i]==t;var u=n.constructor,a=t.constructor;if(u!==a&&!(A.isFunction(u)&&u instanceof u&&A.isFunction(a)&&a instanceof a))return!1;e.push(n),r.push(t);var c=0,s=!0;if("[object Array]"==o){if(c=n.length,s=c==t.length)for(;c--&&(s=T(n[c],t[c],e,r)););}else{for(var f in n)if(A.has(n,f)&&(c++,!(s=A.has(t,f)&&T(n[f],t[f],e,r))))break;if(s){for(f in t)if(A.has(t,f)&&!c--)break;s=!c}}return e.pop(),r.pop(),s};A.isEqual=function(n,t){return T(n,t,[],[])},A.isEmpty=function(n){if(null==n)return!0;if(A.isArray(n)||A.isString(n))return 0===n.length;for(var t in n)if(A.has(n,t))return!1;return!0},A.isElement=function(n){return!(!n||1!==n.nodeType)},A.isArray=b||function(n){return"[object Array]"==l.call(n)},A.isObject=function(n){return n===Object(n)},k(["Arguments","Function","String","Number","Date","RegExp"],function(n){A["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),A.isArguments(arguments)||(A.isArguments=function(n){return!(!n||!A.has(n,"callee"))}),"function"!=typeof/./&&(A.isFunction=function(n){return"function"==typeof n}),A.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},A.isNaN=function(n){return A.isNumber(n)&&n!=+n},A.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},A.isNull=function(n){return null===n},A.isUndefined=function(n){return void 0===n},A.has=function(n,t){return s.call(n,t)},A.noConflict=function(){return n._=t,this},A.identity=function(n){return n},A.times=function(n,t,e){for(var r=Array(Math.max(0,n)),o=0;n>o;o++)r[o]=t.call(e,o);return r},A.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};M.unescape=A.invert(M.escape);var N={escape:new RegExp("["+A.keys(M.escape).join("")+"]","g"),unescape:new RegExp("("+A.keys(M.unescape).join("|")+")","g")};A.each(["escape","unescape"],function(n){A[n]=function(t){return null==t?"":(""+t).replace(N[n],function(t){return M[n][t]})}}),A.result=function(n,t){if(null==n)return void 0;var e=n[t];return A.isFunction(e)?e.call(n):e},A.mixin=function(n){k(A.functions(n),function(t){var e=A[t]=n[t];A.prototype[t]=function(){var n=[this._wrapped];return u.apply(n,arguments),F.call(this,e.apply(A,n))}})};var q=0;A.uniqueId=function(n){var t=++q+"";return n?n+t:t},A.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var C=/(.)^/,G={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},I=/\\|'|\r|\n|\t|\u2028|\u2029/g;A.template=function(n,t,e){var r;e=A.defaults({},e,A.templateSettings);var o=new RegExp([(e.escape||C).source,(e.interpolate||C).source,(e.evaluate||C).source].join("|")+"|$","g"),i=0,u="__p+='";n.replace(o,function(t,e,r,o,a){return u+=n.slice(i,a).replace(I,function(n){return"\\"+G[n]}),e&&(u+="'+\n((__t=("+e+"))==null?'':_.escape(__t))+\n'"),r&&(u+="'+\n((__t=("+r+"))==null?'':__t)+\n'"),o&&(u+="';\n"+o+"\n__p+='"),i=a+t.length,t}),u+="';\n",e.variable||(u="with(obj||{}){\n"+u+"}\n"),u="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+u+"return __p;\n";try{r=new Function(e.variable||"obj","_",u)}catch(a){throw a.source=u,a}if(t)return r(t,A);var c=function(n){return r.call(this,n,A)};return c.source="function("+(e.variable||"obj")+"){\n"+u+"}",c},A.chain=function(n){return A(n).chain()};var F=function(n){return this._chain?A(n).chain():n};A.mixin(A),k(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];A.prototype[n]=function(){var e=this._wrapped;return t.apply(e,arguments),"shift"!=n&&"splice"!=n||0!==e.length||delete e[0],F.call(this,e)}}),k(["concat","join","slice"],function(n){var t=r[n];A.prototype[n]=function(){return F.call(this,t.apply(this._wrapped,arguments))}}),A.extend(A.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}.call(this);
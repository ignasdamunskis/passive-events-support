(()=>{"use strict";function e(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("testPassive",null,t),window.removeEventListener("testPassive",null,t)}catch(e){}return e}window.passiveSupported=e(),function(t=null){const n=t||["scroll","wheel","touchstart","touchmove","touchenter","touchend","touchleave","mouseout","mouseleave","mouseup","mousedown","mousemove","mouseenter","mousewheel","mouseover"],s=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(...t){if(n.includes(t[0])&&(!t[2]||void 0===t[2].passive)){const n=t[1].toString(),[s,...o]=n.split("{"),i=s.replace(/(function|=>)/,"").trim(),u=o.join("{"),c=(i.match(/\(([^)]+)\)/)||[`(${i})`])[0].replace(/[()]/g,""),r=!(!c||!(u.includes("preventDefault")||u.includes(`(${c})`)||u.includes(`(${c},`)||u.includes(`,${c})`)||u.includes(`, ${c})`)));t[2]={...t[2]||{},...e()&&{passive:!r}}}s.call(this,...t)}}(window.passiveEvents)})();
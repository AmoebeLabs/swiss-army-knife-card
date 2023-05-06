import{LitElement,html,css,svg,unsafeCSS}from"lit-element";import{styleMap}from"lit-html/directives/style-map.js";import{unsafeSVG}from"lit-html/directives/unsafe-svg.js";import{ifDefined}from"lit-html/directives/if-defined.js";import{selectUnit}from"@formatjs/intl-utils";import{version}from"../package.json";import{SVG_DEFAULT_DIMENSIONS,SVG_VIEW_BOX,FONT_SIZE}from"./const";import Merge from"./merge";import Utils from"./utils";import Templates from"./templates";import Toolset from"./toolset";console.info(`%c  SWISS-ARMY-KNIFE-CARD  
%c      Version ${version}      `,"color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class SwissArmyKnifeCard extends LitElement{constructor(){if(super(),this.connected=!1,this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.secondaryInfoStr=[],this.viewBoxSize=SVG_VIEW_BOX,this.viewBox={width:SVG_VIEW_BOX,height:SVG_VIEW_BOX},this.toolsets=[],this.tools=[],this.styles={},this.styles.card={},this.entityHistory={},this.entityHistory.needed=!1,this.stateChanged=!0,this.entityHistory.updating=!1,this.entityHistory.update_interval=300,this.dev={},this.dev.debug=!1,this.dev.performance=!1,this.dev.m3=!1,this.configIsSet=!1,this.theme={},this.theme.modeChanged=!1,this.theme.darkMode=!1,this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&1<window.navigator.maxTouchPoints)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[0-9]/.test(window.navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari14=this.isSafari14||/os 15.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari15=this.isSafari15||/os 14.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari16=this.isSafari16||/os 16.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.lovelace=SwissArmyKnifeCard.lovelace,!this.lovelace)throw console.error("card::constructor - Can't get Lovelace panel"),Error("card::constructor - Can't get Lovelace panel");SwissArmyKnifeCard.colorCache||(SwissArmyKnifeCard.colorCache=[]),this.dev.debug&&console.log("*****Event - card - constructor",this.cardId,(new Date).getTime())}static getSystemStyles(){return css`
      :host {
        cursor: default;
        font-size: ${FONT_SIZE}px;
      }

      /* Default settings for the card */
      /* - default cursor */
      /* - SVG overflow is not displayed, ie cutoff by the card edges */
      ha-card {
        cursor: default;
        overflow: hidden;
        
        -webkit-touch-callout: none;  
      }
      
      /* For disabled parts of tools/toolsets */
      /* - No input */
      ha-card.disabled {
        pointer-events: none;
        cursor: default;
      }

      .disabled {
        pointer-events: none !important;
        cursor: default !important;
      }

      /* For 'active' tools/toolsets */
      /* - Show cursor as pointer */
      .hover {
        cursor: pointer;
      }

      /* For hidden tools/toolsets where state for instance is undefined */
      .hidden {
        opacity: 0;
        visibility: hidden;
        transition: visibility 0s 1s, opacity 0.5s linear;
      }

      focus {
        outline: none;
      }
      focus-visible {
        outline: 3px solid blanchedalmond; /* That'll show 'em */
      }
      
      
      @media (print), (prefers-reduced-motion: reduce) {
        .animated {
          animation-duration: 1ms !important;
          transition-duration: 1ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      
      /* Set default host font-size to 10 pixels.
       * In that case 1em = 10 pixels = 1% of 100x100 matrix used
       */
      @media screen and (min-width: 467px) {
        :host {
        font-size: ${FONT_SIZE}px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
        font-size: ${FONT_SIZE}px;
        }
      }

      :host ha-card {
            padding: 0px 0px 0px 0px;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .labelContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .state {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        min-width: 0px;
      }

      #label {
        display: flex;
        line-height: 1;
      }

      #label.bold {
        font-weight: bold;
      }

      #label, #name {
        margin: 3% 0;
      }

      .shadow {
        font-size: 30px;
        font-weight: 700;
        text-anchor: middle;
      }

      .card--dropshadow-5 {
        filter: drop-shadow(0 1px 0 #ccc)
               drop-shadow(0 2px 0 #c9c9c9)
               drop-shadow(0 3px 0 #bbb)
               drop-shadow(0 4px 0 #b9b9b9)
               drop-shadow(0 5px 0 #aaa)
               drop-shadow(0 6px 1px rgba(0,0,0,.1))
               drop-shadow(0 0 5px rgba(0,0,0,.1))
               drop-shadow(0 1px 3px rgba(0,0,0,.3))
               drop-shadow(0 3px 5px rgba(0,0,0,.2))
               drop-shadow(0 5px 10px rgba(0,0,0,.25))
               drop-shadow(0 10px 10px rgba(0,0,0,.2))
               drop-shadow(0 20px 20px rgba(0,0,0,.15));
      }
      .card--dropshadow-medium--opaque--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-medium--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-medium {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-light--sepia90 {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5))
                sepia(90%);
      }

      .card--dropshadow-light {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5));
      }

      .card--dropshadow-down-and-distant {
        filter: drop-shadow(0px 0.05em 0px #b2a98f)
                drop-shadow(0px 14px 10px rgba(0,0,0,0.15))
                drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
      }
      
      .card--filter-none {
      }

      .horseshoe__svg__group {
        transform: translateY(15%);
      }

    `}static getUserStyles(){return this.userContent="",SwissArmyKnifeCard.lovelace.config.sak_user_templates&&SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions&&(this.userContent=SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce((e,t)=>e+t.content,"")),css`${unsafeCSS(this.userContent)}`}static getSakStyles(){return this.sakContent="",SwissArmyKnifeCard.lovelace.config.sak_sys_templates&&SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions&&(this.sakContent=SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce((e,t)=>e+t.content,"")),css`${unsafeCSS(this.sakContent)}`}static getSakSvgDefinitions(){SwissArmyKnifeCard.lovelace.sakSvgContent=null;let e="";SwissArmyKnifeCard.lovelace.config.sak_sys_templates&&SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions&&(e=SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce((e,t)=>e+t.content,"")),SwissArmyKnifeCard.sakSvgContent=unsafeSVG(e)}static getUserSvgDefinitions(){SwissArmyKnifeCard.lovelace.userSvgContent=null;let e="";SwissArmyKnifeCard.lovelace.config.sak_user_templates&&SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions&&(e=SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce((e,t)=>e+t.content,"")),SwissArmyKnifeCard.userSvgContent=unsafeSVG(e)}static get styles(){if(SwissArmyKnifeCard.lovelace||(SwissArmyKnifeCard.lovelace=Utils.getLovelace()),!SwissArmyKnifeCard.lovelace)throw console.error("SAK - Can't get reference to Lovelace"),Error("card::get styles - Can't get Lovelace panel");if(SwissArmyKnifeCard.lovelace.config.sak_sys_templates)return SwissArmyKnifeCard.lovelace.config.sak_user_templates||console.warning("SAK - User Templates reference NOT defined. Did you NOT include them?"),SwissArmyKnifeCard.getSakSvgDefinitions(),SwissArmyKnifeCard.getUserSvgDefinitions(),css`
      ${SwissArmyKnifeCard.getSystemStyles()}
      ${SwissArmyKnifeCard.getSakStyles()}
      ${SwissArmyKnifeCard.getUserStyles()}
    `;throw console.error("SAK - System Templates reference NOT defined."),Error("card::get styles - System Templates reference NOT defined!")}set hass(s){if(this.counter||(this.counter=0),this.counter+=1,s.themes.darkMode!==this.theme.darkMode&&(this.theme.darkMode=s.themes.darkMode,this.theme.modeChanged=!0),this.dev.debug&&console.log("*****Event - card::set hass",this.cardId,(new Date).getTime()),this._hass=s,this.connected||this.dev.debug&&console.log("set hass but NOT connected",this.cardId),this.config.entities){let a=!1,e,r=0,t=!1;let o=!1,n;for(e of this.config.entities){if(this.entities[r]=s.states[this.config.entities[r].entity],void 0===this.entities[r]&&console.error("SAK - set hass, entity undefined: ",this.config.entities[r].entity),this.config.entities[r].secondary_info&&(t=!0,l=this.entities[r][this.config.entities[r].secondary_info],(l=this._buildSecondaryInfo(l,this.config.entities[r]))!==this.secondaryInfoStr[r])&&(this.secondaryInfoStr[r]=l,a=!0),this.config.entities[r].attribute){let e=this.config.entities[r]["attribute"],t="",s="";var d,l=this.config.entities[r].attribute.indexOf("["),h=this.config.entities[r].attribute.indexOf(".");let i="";-1!==l?(e=this.config.entities[r].attribute.substr(0,l),d=(t=this.config.entities[r].attribute.substr(l,this.config.entities[r].attribute.length-l))[1],i=t.substr(4,t.length-4),s=this.entities[r].attributes[e][d][i]):-1!==h?(e=this.config.entities[r].attribute.substr(0,h),t=this.config.entities[r].attribute.substr(l,this.config.entities[r].attribute.length-l),i=t.substr(1,t.length-1),s=this.entities[r].attributes[e][i],console.log("set hass, attributes with map",this.config.entities[r].attribute,e,t)):s=this.entities[r].attributes[e],(n=this._buildState(s,this.config.entities[r]))!==this.attributesStr[r]&&(this.attributesStr[r]=n,a=!0),o=!0}o||t||((n=this._buildState(this.entities[r].state,this.config.entities[r]))!==this.entitiesStr[r]&&(this.entitiesStr[r]=n,a=!0),this.dev.debug&&console.log("set hass - attrSet=false",this.cardId,(new Date).getSeconds().toString()+"."+(new Date).getMilliseconds().toString(),n)),r+=1,o=!1,t=!1}(a||this.theme.modeChanged)&&(this.toolsets&&this.toolsets.map(e=>(e.updateValues(),!0)),this.requestUpdate(),this.theme.modeChanged=!1,--this.counter)}}setConfig(c){if(this.dev.performance&&console.time(`--> ${this.cardId} PERFORMANCE card::setConfig`),this.dev.debug&&console.log("*****Event - setConfig",this.cardId,(new Date).getTime()),(c=JSON.parse(JSON.stringify(c))).dev&&(this.dev={...this.dev,...c.dev}),this.dev.debug&&console.log("setConfig",this.cardId),!c.layout)throw Error("card::setConfig - No layout defined");if(c.entities){var u=this._computeDomain(c.entities[0].entity);if("sensor"!==u&&c.entities[0].attribute&&!isNaN(c.entities[0].attribute))throw Error("card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT")}u=Merge.mergeDeep(c);this.config=u,this.toolset=[];const i=this;function d(e,t){var s;return t?.template?((s=i.lovelace.config.sak_user_templates.templates[t.template.name])||console.error("Template not found...",t.template,s),s=Templates.replaceVariables3(t.template.variables,s),Merge.mergeDeep(s)):("template"===e&&console.log("findTemplate return key=template/value",e,void 0),t)}c=JSON.stringify(this.config,d);const l=JSON.parse(c).layout.toolsets;if(this.config.layout.template&&(this.config.layout=JSON.parse(c).layout),this.config.layout.toolsets.map((r,o)=>{let n=null;this.toolsets||(this.toolsets=[]);{let a=!1,e=[];n=l[o].tools,r.tools&&r.tools.map((s,i)=>(l[o].tools.map((e,t)=>(s.id===e.id&&(r.template&&(this.config.layout.toolsets[o].position&&(l[o].position=Merge.mergeDeep(this.config.layout.toolsets[o].position)),n[t]=Merge.mergeDeep(n[t],s),n[t]=JSON.parse(JSON.stringify(n[t],d)),a=!0),this.dev.debug)&&console.log("card::setConfig - got toolsetCfg toolid",s,i,e,t,s),l[o].tools[t]=Templates.getJsTemplateOrValueConfig(l[o].tools[t],Merge.mergeDeep(l[o].tools[t])),a)),a||(e=e.concat(r.tools[i])),a)),n=n.concat(e)}r=l[o];var e=new Toolset(this,r);return this.toolsets.push(e),!0}),this.dev.m3&&(console.log("*** M3 - Checking for m3.yaml template to convert..."),this.lovelace.config.sak_user_templates.templates.m3)){u=this.lovelace.config.sak_user_templates.templates["m3"];console.log("*** M3 - Found. Material 3 conversion starting...");let t="",s="",i="",a="",r="",o="",n="",d="",l="",h="";const E={};var m,f,g={},p={};u.entities.map(e=>(["ref.palette","sys.color","sys.color.light","sys.color.dark"].includes(e.category_id)&&!e.tags.includes("alias")&&(E[e.id]={value:e.value,tags:e.tags}),"ref.palette"===e.category_id&&(t+=`${e.id}: '${e.value}'\n`,"md.ref.palette.primary40"===e.id&&(o=e.value),"md.ref.palette.primary80"===e.id&&(l=e.value),"md.ref.palette.neutral40"===e.id&&(n=e.value),"md.ref.palette.neutral80"===e.id)&&(h=e.value),"sys.color"===e.category_id&&(s+=`${e.id}: '${e.value}'\n`),"sys.color.light"===e.category_id&&(i+=`${e.id}: '${e.value}'\n`,"md.sys.color.surface.light"===e.id)&&(r=e.value),"sys.color.dark"===e.category_id&&(a+=`${e.id}: '${e.value}'\n`,"md.sys.color.surface.dark"===e.id)&&(d=e.value),!0)),["primary","secondary","tertiary","error","neutral","neutral-variant"].forEach(t=>{[5,15,25,35,45,65,75,85].forEach(e=>{E["md.ref.palette."+t+e.toString()]={value:this._getGradientValue(E["md.ref.palette."+t+(e-5).toString()].value,E["md.ref.palette."+t+(e+5).toString()].value,.5),tags:[...E["md.ref.palette."+t+(e-5).toString()].tags]},E["md.ref.palette."+t+e.toString()].tags[3]=t+e.toString()}),E[`md.ref.palette.${t}7`]={value:this._getGradientValue(E[`md.ref.palette.${t}5`].value,E[`md.ref.palette.${t}10`].value,.5),tags:[...E[`md.ref.palette.${t}10`].tags]},E[`md.ref.palette.${t}7`].tags[3]=t+"7",E[`md.ref.palette.${t}92`]={value:this._getGradientValue(E[`md.ref.palette.${t}90`].value,E[`md.ref.palette.${t}95`].value,.5),tags:[...E[`md.ref.palette.${t}90`].tags]},E[`md.ref.palette.${t}92`].tags[3]=t+"92",E[`md.ref.palette.${t}97`]={value:this._getGradientValue(E[`md.ref.palette.${t}95`].value,E[`md.ref.palette.${t}99`].value,.5),tags:[...E[`md.ref.palette.${t}90`].tags]},E[`md.ref.palette.${t}97`].tags[3]=t+"97"});for([m,f]of Object.entries(E))g[m]=`theme-${f.tags[1]}-${f.tags[2]}-${f.tags[3]}: rgb(${v(f.value)})`,p[m]=`theme-${f.tags[1]}-${f.tags[2]}-${f.tags[3]}-rgb: `+v(f.value);function v(e){var t={},e=(t.r=Math.round(parseInt(e.substr(1,2),16)),t.g=Math.round(parseInt(e.substr(3,2),16)),t.b=Math.round(parseInt(e.substr(5,2),16)),t.r+`,${t.g},`+t.b);return e}function b(e,t,s,i,a){const r={},o={};r.r=Math.round(parseInt(e.substr(1,2),16)),r.g=Math.round(parseInt(e.substr(3,2),16)),r.b=Math.round(parseInt(e.substr(5,2),16)),o.r=Math.round(parseInt(t.substr(1,2),16)),o.g=Math.round(parseInt(t.substr(3,2),16)),o.b=Math.round(parseInt(t.substr(5,2),16));let n="",d,l,h;return s.forEach((e,t)=>{d=Math.round(e*o.r+(1-e)*r.r),l=Math.round(e*o.g+(1-e)*r.g),h=Math.round(e*o.b+(1-e)*r.b),n=(n+=`${i+(t+1).toString()}-${a}: rgb(${d},${l},${h})\n`)+`${i+(t+1).toString()}-${a}-rgb: ${d},${l},${h}\n`}),n}var y,w,c=[.03,.05,.08,.11,.15,.19,.24,.29,.35,.4],u=[.05,.08,.11,.15,.19,.24,.29,.35,.4,.45],S=b(r,n,c,"  theme-ref-elevation-surface-neutral","light"),_=E["md.ref.palette.neutral-variant40"].value,_=b(r,_,c,"  theme-ref-elevation-surface-neutral-variant","light"),x=b(r,o,c,"  theme-ref-elevation-surface-primary","light"),C=E["md.ref.palette.secondary40"].value,C=b(r,C,c,"  theme-ref-elevation-surface-secondary","light"),I=E["md.ref.palette.tertiary40"].value,I=b(r,I,c,"  theme-ref-elevation-surface-tertiary","light"),k=E["md.ref.palette.error40"].value,k=b(r,k,c,"  theme-ref-elevation-surface-error","light"),c=b(d,h,u,"  theme-ref-elevation-surface-neutral","dark"),$=E["md.ref.palette.neutral-variant80"].value,$=b(d,$,u,"  theme-ref-elevation-surface-neutral-variant","dark"),M=b(d,l,u,"  theme-ref-elevation-surface-primary","dark"),N=E["md.ref.palette.secondary80"].value,N=b(d,N,u,"  theme-ref-elevation-surface-secondary","dark"),A=E["md.ref.palette.tertiary80"].value,A=b(d,A,u,"  theme-ref-elevation-surface-tertiary","dark"),D=E["md.ref.palette.error80"].value,D=b(d,D,u,"  theme-ref-elevation-surface-error","dark");let e="";for([y,w]of Object.entries(g))"theme-ref"===w.substring(0,9)&&(e=(e+=`  ${w}
`)+`  ${p[y]}
`);console.log(S+_+x+C+I+k+c+$+M+N+A+D+e),console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...")}this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();u=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=u[0]*SVG_DEFAULT_DIMENSIONS,this.viewBox.height=u[1]*SVG_DEFAULT_DIMENSIONS,this.config.layout.styles?.card&&(this.styles.card=this.config.layout.styles.card),this.dev.debug&&console.log("Step 5: toolconfig, list of toolsets",this.toolsets),this.dev.debug&&console.log("debug - setConfig",this.cardId,this.config),this.dev.performance&&console.timeEnd(`--> ${this.cardId} PERFORMANCE card::setConfig`),this.configIsSet=!0}connectedCallback(){this.dev.performance&&console.time(`--> ${this.cardId} PERFORMANCE card::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.cardId,(new Date).getTime()),this.connected=!0,super.connectedCallback(),this.entityHistory.update_interval&&(this.updateOnInterval(),clearInterval(this.interval),this.interval=setInterval(()=>this.updateOnInterval(),this._hass?1e3*this.entityHistory.update_interval:1e3)),this.dev.debug&&console.log("ConnectedCallback",this.cardId),this.requestUpdate(),this.dev.performance&&console.timeEnd(`--> ${this.cardId} PERFORMANCE card::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.cardId,(new Date).getTime()),this.interval&&(clearInterval(this.interval),this.interval=0),super.disconnectedCallback(),this.dev.debug&&console.log("disconnectedCallback",this.cardId),this.connected=!1,this.dev.performance&&console.timeEnd(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - card::firstUpdated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map(async e=>(e.firstUpdated(t),!0))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map(async e=>(e.updated(t),!0))}render(){if(this.dev.performance&&console.time(`--> ${this.cardId} PERFORMANCE card::render`),this.dev.debug&&console.log("*****Event - render",this.cardId,(new Date).getTime()),this.connected){let e;try{e=this.config.disable_card?html`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `:html`
                  <ha-card style="${styleMap(this.styles.card)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `}catch(e){console.error(e)}return this.dev.performance&&console.timeEnd(`--> ${this.cardId} PERFORMANCE card::render`),e}this.dev.debug&&console.log("render but NOT connected",this.cardId,(new Date).getTime())}_renderSakSvgDefinitions(){return svg`
    ${SwissArmyKnifeCard.sakSvgContent}
    `}_renderUserSvgDefinitions(){return svg`
    ${SwissArmyKnifeCard.userSvgContent}
    `}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}_RenderToolsets(){return this.dev.debug&&console.log("all the tools in renderTools",this.tools),svg`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map(e=>e.render())}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `}_renderCardAttributes(){var t,s=[];this._attributes="";for(let e=0;e<this.entities.length;e++)t=this.attributesStr[e]||this.secondaryInfoStr[e]||this.entitiesStr[e],s.push(t);return this._attributes=s}_renderSvg(){var e=this.config.card_filter||"card--filter-none",t=[],s=(this._renderCardAttributes(),this._RenderToolsets());return t.push(svg`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${e}"
       style="${styleMap(this.styles.card)}"
       data-entity-0="${this._attributes[0]}"
       data-entity-1="${ifDefined(this._attributes[1])}"
       data-entity-2="${ifDefined(this._attributes[2])}"
       data-entity-3="${ifDefined(this._attributes[3])}"
       data-entity-4="${ifDefined(this._attributes[4])}"
       data-entity-5="${ifDefined(this._attributes[5])}"
       data-entity-6="${ifDefined(this._attributes[6])}"
       data-entity-7="${ifDefined(this._attributes[7])}"
       data-entity-8="${ifDefined(this._attributes[8])}"
       data-entity-9="${ifDefined(this._attributes[9])}"
       viewBox="0 0 ${this.viewBox.width} ${this.viewBox.height}"
      >
        <g style="${styleMap(this.config.layout?.styles?.toolsets)}">
          ${s}
        </g>
    </svg>`),svg`${t}`}_buildUom(e,t,s){return e?.unit||s?.unit||t?.attributes.unit_of_measurement||""}toLocale(e,t="unknown"){var s=this._hass.selectedLanguage||this._hass.language,s=this._hass.resources[s];return s&&s[e]?s[e]:t}_buildState(e,t){var s,i;return"number"!=typeof e?"unavailable"===e?"-ua-":e:"brightness"===t.format?""+Math.round(e/255*100):(s=Math.abs(Number(e)),e=Math.sign(e),["0","-0"].includes(e)?e:void 0===t.decimals||isNaN(t.decimals)||isNaN(s)?"-1"===e?"-"+(Math.round(100*s)/100).toString():(Math.round(100*s)/100).toString():(i=10**t.decimals,"-1"===e?"-"+(Math.round(s*i)/i).toFixed(t.decimals).toString():(Math.round(s*i)/i).toFixed(t.decimals).toString()))}_buildSecondaryInfo(t,s){const e=e=>e<10?"0"+e:e;var i,a=this._hass.selectedLanguage||this._hass.language;if(["relative","total","date","time","datetime"].includes(s.format)){var r=new Date(t);if(!(r instanceof Date)||isNaN(r.getTime()))return t;let e;switch(s.format){case"relative":var o=selectUnit(r,new Date);e=new Intl.RelativeTimeFormat(a,{numeric:"auto"}).format(o.value,o.unit);break;case"total":case"precision":e="Not Yet Supported";break;case"date":e=new Intl.DateTimeFormat(a,{year:"numeric",month:"numeric",day:"numeric"}).format(r);break;case"time":e=new Intl.DateTimeFormat(a,{hour:"numeric",minute:"numeric",second:"numeric"}).format(r);break;case"datetime":e=new Intl.DateTimeFormat(a,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).format(r)}return e}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===s.format?Math.round(t/255*100)+" %":"duration"===s.format?(s=t,t=Math.floor(s/3600),i=Math.floor(s%3600/60),s=Math.floor(s%3600%60),0<t?`${t}:${e(i)}:`+e(s):0<i?i+":"+e(s):0<s?""+s:null):void 0}_computeState(e,t){var s;return isNaN(e)?(console.log("computestate - NAN",e,t),e):(e=Number(e),void 0===t||isNaN(t)||isNaN(e)?Math.round(100*e)/100:(s=10**t,(Math.round(e*s)/s).toFixed(t)))}_calculateColor(t,s,i){var a=Object.keys(s).map(e=>Number(e)).sort((e,t)=>e-t);let r,o,n;var d=a.length;if(t<=a[0])return s[a[0]];if(t>=a[d-1])return s[a[d-1]];for(let e=0;e<d-1;e++){var l=a[e],h=a[e+1];if(l<=t&&t<h){if([r,o]=[s[l],s[h]],!i)return r;n=this._calculateValueBetween(l,h,t);break}}return this._getGradientValue(r,o,n)}_calculateColor2(t,s,i,a,r){var o=Object.keys(s).map(e=>Number(e)).sort((e,t)=>e-t);let n,d,l;var h=o.length;if(t<=o[0])return s[o[0]];if(t>=o[h-1])return s[o[h-1]];for(let e=0;e<h-1;e++){var c=o[e],u=o[e+1];if(c<=t&&t<u){if([n,d]=[s[c].styles[i][a],s[u].styles[i][a]],!r)return n;l=this._calculateValueBetween(c,u,t);break}}return this._getGradientValue(n,d,l)}_calculateValueBetween(e,t,s){return(Math.min(Math.max(s,e),t)-e)/(t-e)}_getColorVariable(e){e=e.substr(4,e.length-5);return window.getComputedStyle(this).getPropertyValue(e)}_getGradientValue(e,t,s){var e=this._colorToRGBA(e),t=this._colorToRGBA(t),i=1-s,a=Math.floor(e[0]*i+t[0]*s),r=Math.floor(e[1]*i+t[1]*s),o=Math.floor(e[2]*i+t[2]*s),e=Math.floor(e[3]*i+t[3]*s);return"#"+this._padZero(a.toString(16))+this._padZero(r.toString(16))+this._padZero(o.toString(16))+this._padZero(e.toString(16))}_padZero(e){return(e=e.length<2?"0"+e:e).substr(0,2)}_computeDomain(e){return e.substr(0,e.indexOf("."))}_computeEntity(e){return e.substr(e.indexOf(".")+1)}_colorToRGBA(e){var t=SwissArmyKnifeCard.colorCache[e];if(t)return t;let s=e;"var"===e.substr(0,3).valueOf()&&(s=this._getColorVariable(e));t=window.document.createElement("canvas"),t.width=t.height=1,t=t.getContext("2d"),t.clearRect(0,0,1,1),t.fillStyle=s,t.fillRect(0,0,1,1),t=[...t.getImageData(0,0,1,1).data];return SwissArmyKnifeCard.colorCache[e]=t}updateOnInterval(){this._hass?(this.stateChanged&&!this.entityHistory.updating&&this.updateData(),this.entityHistory.needed?(window.clearInterval(this.interval),this.interval=setInterval(()=>this.updateOnInterval(),1e3*this.entityHistory.update_interval)):this.interval&&(window.clearInterval(this.interval),this.interval=0)):this.dev.debug&&console.log("UpdateOnInterval - NO hass, returning")}async fetchRecent(e,t,s,i){let a="history/period";return t&&(a+="/"+t.toISOString()),a+="?filter_entity_id="+e,s&&(a+="&end_time="+s.toISOString()),i&&(a+="&skip_initial_state"),a+="&minimal_response",this._hass.callApi("GET",a)}async updateData(){this.entityHistory.updating=!0,this.dev.debug&&console.log("card::updateData - ENTRY",this.cardId);const o=[];let n=0;this.toolsets.map((e,r)=>(e.tools.map((e,t)=>{var s,i,a;return"bar"===e.type&&(s=new Date,(i=new Date).setHours(s.getHours()-e.tool.config.hours),a=this.config.entities[e.tool.config.entity_index].attribute||null,o[n]={tsidx:r,entityIndex:e.tool.config.entity_index,entityId:this.entities[e.tool.config.entity_index].entity_id,attrId:a,start:i,end:s,type:"bar",idx:t},n+=1),!0}),!0)),this.dev.debug&&console.log("card::updateData - LENGTH",this.cardId,o.length,o),this.stateChanged=!1,this.dev.debug&&console.log("card::updateData, entityList from tools",o);try{var e=o.map((e,t)=>this.updateEntity(e,t,e.start,e.end));await Promise.all(e)}finally{this.entityHistory.updating=!1}}async updateEntity(t,e,s,i){var a=[];let r=await this.fetchRecent(t.entityId,s,i,!1);r[0]&&0<r[0].length&&(t.attrId&&(s=this.entities[t.entityIndex].attributes[this.config.entities[t.entityIndex].attribute],t.state=s),r=(r=r[0].filter(e=>t.attrId?!isNaN(parseFloat(e.attributes[t.attrId])):!isNaN(parseFloat(e.state)))).map(e=>({last_changed:e.last_changed,state:t.attrId?Number(e.attributes[t.attrId]):Number(e.state)}))),a=[...a,...r],this.uppdate(t,a)}uppdate(e,t){if(t){const r=(new Date).getTime();let i=24,a=2;"bar"===e.type&&(this.dev.debug&&console.log("entity.type == bar",e),i=this.toolsets[e.tsidx].tools[e.idx].tool.config.hours,a=this.toolsets[e.tsidx].tools[e.idx].tool.config.barhours);var s=t.reduce((e,t)=>{return e=e,t=t,s=(r-new Date(t.last_changed).getTime())/36e5/a-i/a,s=Math.floor(Math.abs(s)),e[s]||(e[s]=[]),e[s].push(t),e;var s},[]);if(s.length=Math.ceil(i/a),0!==Object.keys(s).length){t=Object.keys(s)[0];"0"!==t&&(s[0]=[],s[0].push(s[t][0]));for(let e=0;e<i/a;e++)s[e]||(s[e]=[],s[e].push(s[e-1][s[e-1].length-1]));t=(this.coords=s).map(e=>{return s="state",(e=e).reduce((e,t)=>e+Number(t[s]),0)/e.length;var s}),"bar"===e.type&&(this.toolsets[e.tsidx].tools[e.idx].tool.series=[...t]),this.requestUpdate()}}}getCardSize(){return 4}}customElements.define("swiss-army-knife-card",SwissArmyKnifeCard);
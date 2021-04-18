(self.webpackChunkcovid=self.webpackChunkcovid||[]).push([[322],{322:(e,t,o)=>{"use strict";o.r(t),o.d(t,{onStart:()=>v});var a=o(509),n=o(805),s=o(261);class c extends n.Z{static getConfig(){return{className:"Covid.view.HeaderContainer",cls:["covid-header-container"],layout:{ntype:"hbox",align:"stretch"},items:[{ntype:"component",minWidth:267,reference:"logo",style:{margin:"10px"},width:267,vdom:{tag:"img",src:"https://raw.githubusercontent.com/neomjs/pages/master/resources/images/apps/covid/covid_logo_dark.jpg"}},{ntype:"container",layout:{ntype:"vbox",align:"stretch"},items:[{ntype:"container",height:65,layout:{ntype:"hbox"},reference:"total-stats",itemDefaults:{ntype:"component"},items:[{cls:["covid-numberbox"],vdom:{cn:[{cls:["covid-numberbox-title","cases"],html:"Cases"},{cls:["covid-numberbox-number","cases"]}]}},{cls:["covid-numberbox"],vdom:{cn:[{cls:["covid-numberbox-title","active"],html:"Active"},{cls:["covid-numberbox-number","active"]}]}},{cls:["covid-numberbox"],vdom:{cn:[{cls:["covid-numberbox-title","recovered"],html:"Recovered"},{cls:["covid-numberbox-number","recovered"]}]}},{cls:["covid-numberbox"],vdom:{cn:[{cls:["covid-numberbox-title","deaths"],html:"Deaths"},{cls:["covid-numberbox-number","deaths"]}]}}]},{ntype:"container",layout:{ntype:"hbox"},itemDefaults:{ntype:"component"},items:[{module:a.Z,flex:"none",handler:"onSwitchThemeButtonClick",height:25,iconCls:"fa fa-sun",style:{marginLeft:"10px",marginTop:"15px"},text:"Theme Light"},{module:a.Z,flex:"none",handler:"onReloadDataButtonClick",height:25,iconCls:"fa fa-sync-alt",style:{marginLeft:"10px",marginTop:"15px"},text:"Reload Data"},{module:s.Z,height:25,reference:"last-update",style:{marginLeft:"10px",marginTop:"18px"},text:"Last Update:"}]}]}]}}}Neo.applyClassConfig(c);var r=o(671),i=o(926),m=o(643);class l extends m.Z{static getStaticConfig(){return{locales:"default"}}static getConfig(){return{className:"Covid.Util"}}static formatNumber(e,t){let o=e.value;return Neo.isNumber(o)?(o=o.toLocaleString(l.locales),"string"!=typeof t?o:`<span style="color:${t};">${o}</span>`):o||"N/A"}}Neo.applyClassConfig(l);const d=l;class u extends r.Z{static getConfig(){return{className:"Covid.view.MainContainerController",apiSummaryUrl:"https://disease.sh/v2/all"}}onConstructed(){super.onConstructed(),this.loadSummaryData()}applySummaryData(e){let t=this,o=t.getReference("total-stats"),a=o.vdom;t.summaryData=e,a.cn[0].cn[1].html=d.formatNumber({value:e.cases}),a.cn[1].cn[1].html=d.formatNumber({value:e.active}),a.cn[2].cn[1].html=d.formatNumber({value:e.recovered}),a.cn[3].cn[1].html=d.formatNumber({value:e.deaths}),o.vdom=a,o=t.getReference("last-update"),a=o.vdom,a.html="Last Update: "+new Intl.DateTimeFormat("default",{hour:"numeric",minute:"numeric",second:"numeric"}).format(new Date(e.updated)),o.vdom=a}loadSummaryData(){const e=this;fetch(e.apiSummaryUrl).then((e=>e.json())).then((t=>e.applySummaryData(t))).catch((t=>console.log("Can’t access "+e.apiSummaryUrl,t)))}onReloadDataButtonClick(e){this.loadSummaryData()}onSwitchThemeButtonClick(e){let t,o,a,n,s,c=e.component,r=this.component,m=this.getReference("logo"),l=m.vdom;"Theme Light"===c.text?(t="Theme Dark",a="../dist/development/neo-theme-light-no-css-vars.css",n="fa fa-moon",s="neo-theme-light"):(t="Theme Light",a="../dist/development/neo-theme-dark-no-css-vars.css",n="fa fa-sun",s="neo-theme-dark"),l.src="https://raw.githubusercontent.com/neomjs/pages/master/resources/images/apps/covid/"+("neo-theme-dark"===s?"covid_logo_dark.jpg":"covid_logo_light.jpg"),m.vdom=l,Neo.config.useCssVars?(o=[...r.cls],r.cls.forEach((e=>{e.includes("neo-theme")&&i.Z.remove(o,e)})),i.Z.add(o,s),r.cls=o,c.set({iconCls:n,text:t})):Neo.main.addon.Stylesheet.swapStyleSheet({href:a,id:"neo-theme"}).then((e=>{c.text=t}))}}Neo.applyClassConfig(u);var h=o(748);class p extends h.Z{static getConfig(){return{className:"Covid.view.MainContainer",ntype:"main-container",autoMount:!0,controller:u,layout:{ntype:"vbox",align:"stretch"},items:[{module:c,height:120},{ntype:"component",vdom:{innerHTML:"Center"}},{ntype:"component",vdom:{innerHTML:"Footer"}}]}}}Neo.applyClassConfig(p);const v=()=>Neo.app({mainView:p,name:"Covid"})}}]);
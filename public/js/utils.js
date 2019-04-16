// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());
//supplant, inspired by Crockford
jQuery.supplant=function(n,r){return n.replace(/{([^{}]*)}/g,function(n,t){for(var e=t.split("."),u=1,o=e.length,p=r[e[0]];u<o&&void 0!==p;u++)p=p[e[u]];return"string"==typeof p||"number"==typeof p?p:n})};
//materialize
(function($){
  $(function(){
    $('.sidenav').sidenav();
  });
})(jQuery);

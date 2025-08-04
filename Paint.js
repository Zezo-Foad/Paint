"use strict";
window.CSSInsertEngine = new CSSStyleSheet();
window.CSSEngine = document.styleSheets;

if (typeof window.CSSStyleSheet !== "function" || typeof document.adoptedStyleSheets !== "object") {
  const style = document.createElement("style");
  style.id="Paint-Emergency-CSSEngine";  
  document.head.appendChild(style);
  window.CSSInsertEngine = style.sheet;
  console.log(`Backup engine is Running....`);
}

function Paint(selector,cssText) {
	
var insertOne = function (CSSCode) {
  if (CSSInsertEngine && CSSInsertEngine.insertRule) {
    CSSInsertEngine.insertRule(CSSCode, CSSInsertEngine.cssRules.length);
    if (!document.adoptedStyleSheets.includes(CSSInsertEngine)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, CSSInsertEngine];
    }
    const alreadyInEngine = Array.from(CSSEngine).includes(CSSInsertEngine);
    if (!alreadyInEngine) {
      CSSEngine = [...CSSEngine, CSSInsertEngine];
    }
  }
};
	
const CSSCode = `${selector}{
  ${cssText}
}`;

insertOne(CSSCode);
	return new Proxy({}, {  
    get(_, pseudoClass) {  
      return (...styles) => {  
        if(pseudoClass){
        	const CSSCode = `${selector}:${pseudoClass}{
  ${pseudoClass,styles}
}`;
        	insertOne(CSSCode);
        }
      };  
    }  
  });
}
Paint.getCSSObj = function (selector, options = {}) {
	const {
		multiple = false,
		pusedo // true | false | "only"
	} = options;

	const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
	let results = [];
if(options.Create==true) {
  	if(!Paint.exists(selector)){
  		if(options.pusedo){
  			Paint(selector+options.pusedo,"");
  		}else{
  			Paint(selector,"");
  		}
  	}
  }
	for (const CSSs of CSSEngine) {
		for (const Rules of CSSs.cssRules) {
			if (!Rules.selectorText) continue;

			const selText = Rules.selectorText;
			const hasPseudo = selText.includes(":");
			const matches = regex.test(selText);

			if (!matches) continue;
			if (pusedo === "only" && !hasPseudo) continue;
			if (pusedo === false && hasPseudo) continue;

			if (!multiple) return Rules.style;
			results.push(Rules);
		}
	}
	return multiple ? results : false;
};
Paint.getCSS = function (selector, options = {}) {
	const {
		multiple = false,
		pusedo
	} = options;

	const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
	let results = [];

	for (const CSSs of CSSEngine) {
		for (const Rules of CSSs.cssRules) {
			if (!Rules.selectorText) continue;

			const selText = Rules.selectorText;
			const hasPseudo = selText.includes(":");
			const matches = regex.test(selText);

			if (!matches) continue;

			if (pusedo === "only" && !hasPseudo) continue;
			if (pusedo === false && hasPseudo) continue;

			if (!multiple) return Rules.style.cssText;
			results.push(Rules.style.cssText);
		}
	}

	return multiple ? results : false;
};
let simulateState = {
  i: 0,
  running: false,
  intervalIDs: [],
  obj: null,
  history:{
  	past:"",
  	future:""
  },
  Applyed:true,
  current:0
};
Paint.simulate = function(obj) {
	if(simulateState.history.past==""){
		simulateState.history.past = Paint.getCSS(obj.selector);
	}
	if(simulateState.history.future==""){
		simulateState.history.past = Paint.getCSS(obj.selector+obj.pusedo);
	}
	simulateState.obj=obj;

function repeat() {
  setTimeout(() => {
    Paint.forceState({
  	selector:obj.selector,
	  pusedo:obj.pusedo
    });
 if (simulateState.Applyed == true && simulateState.current < obj.times) {
  	setTimeout(function() {
   	Paint.forceState({
  	selector:obj.selector,
	  pusedo:obj.pusedo
    });
    		repeat();
    	},obj.timeout);
    }else {
   	Paint.forceState({
  	selector:obj.selector,
	  pusedo:obj.pusedo
    });
    Paint.getCSSObj(obj.selector).cssText = simulateState.history.past;
    simulateState.Applyed = false;
    }
  }, obj.timeout);
  simulateState.current++;
}

repeat();
	};
Paint.simulate.continue = function (){
	simulateState.Applyed = true;
	Paint.simulate(simulateState.obj);
};
Paint.simulate.pause = function (){
	simulateState.Applyed = false;
	console.log(simulateState.obj);
	console.log(simulateState.obj.selector);
};
Paint.root = {
  set: function (variable, value) {
    return Paint.getCSSObj(":root").setProperty(variable, value);
  },
  get: function (variable) {
    return Paint.getCSSObj(":root").getPropertyValue(variable);
  },
  delete: function (variable) {
  	Paint.getCSSObj(":root").removeProperty(variable);
  }
};
Paint.fail = function (){

window.CSSStyleSheet = undefined;
document.adoptedStyleSheet = undefined;
};
Paint.exists = function (selector) {
  const escapedSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`^${escapedSelector}$`);

  for (const CSSs of CSSEngine) {
    let rules;
    try {
      rules = CSSs.cssRules;
    } catch {
      continue;
    }

    for (const rule of rules) {
      if (rule.selectorText && regex.test(rule.selectorText.trim())) {
        return true;
      }
    }
  }
  return false;
};

Paint.getComputed = function (selector){
	return window.getComputedStyle(document.querySelector(selector));
};

const Store = {
    past: "",
    future: "",
    Applyed: false,
    originalStyles: {}
};

Paint.forceState = function (obj) {
  const selector = obj.selector;
  const pseudo = obj.pusedo;

  const cssObj = Paint.getCSSObj(selector + pseudo);
  if (!cssObj) {
    console.warn("Invalid CSS object for selector:", selector);
    return;
  }

  const Fut = cssObj.cssText;
  const Prev = Paint.getCSSObj(selector).cssText;
  
  if (!Store.Applyed) {
    Store.Applyed = true;

    if (Store.past === "") {
      Store.past = Paint.getCSSObj(selector).cssText;
    }
    if (Store.future === "") {
      Store.future = cssObj.cssText;
    }
    Store.originalStyles[selector] = Paint.getCSSObj(selector).cssText;
    Paint.getCSSObj(selector).cssText += Fut;
  } else {
    Store.Applyed = false;
    if (Store.originalStyles[selector]) {
      Paint.getCSSObj(selector).cssText = Store.originalStyles[selector];
    }
    Paint.getCSSObj(selector).cssText = Paint.getCSSObj(selector).cssText.replace(Fut, "");
  }
};

Paint.getSheet = function (url){
	let final = {};
	document.styleSheets.forEach((sht)=>{
		if(String(sht.href).includes(url)){
		  final = sht;
		}
	});
	return final.cssRules;
};
Paint.addRule = function (Rule) {
var insertOne = function (CSSCode) {
  if (CSSInsertEngine && CSSInsertEngine.insertRule) {
    CSSInsertEngine.insertRule(CSSCode, CSSInsertEngine.cssRules.length);
    if (!document.adoptedStyleSheets.includes(CSSInsertEngine)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, CSSInsertEngine];
    }
    const alreadyInEngine = Array.from(CSSEngine).includes(CSSInsertEngine);
    if (!alreadyInEngine) {
      CSSEngine = [...CSSEngine, CSSInsertEngine];
    }
  }
};
insertOne(Rule);
};
window.Paint=Paint;

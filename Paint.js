"use strict";
window.sheetX = new CSSStyleSheet();
window.CSSInsertEngine = sheetX;
window.CSSEngine = document.styleSheets;

if (typeof window.CSSStyleSheet !== "function" || typeof document.adoptedStyleSheets !== "object") {
  const style = document.createElement("style");
  style.id="Paint-Emergency-CSSEngine";  
  document.head.appendChild(style);
  window.CSSInsertEngine = style.sheet;
  console.log(`Backup engine is Running....`);
}
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
const Store = {
    past: "",
    future: "",
    Applyed: false,
    originalStyles: {}
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
Paint.addRule = function(target, ruleText) {
    if (!target) target = CSSInsertEngine; // افتراضيًا الشيت الحالي

    // لو target هو CSSMediaRule
    if (target instanceof CSSMediaRule || CSSContainerRule) {
        target.insertRule(ruleText, target.cssRules.length);
    } 
    // لو target هو CSSStyleSheet
    else if (target instanceof CSSStyleSheet) {
        target.insertRule(ruleText, target.cssRules.length);
    } 
    else {
        console.warn("Paint.addRule: Invalid target for insertRule", target);
    }
};
Paint.getCSSObj = function(selector, options = {}) {
    const { multiple = false, pusedo, Create = false } = options;
    const regex = new RegExp(selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
    let results = [];

    // لو عايز create و selector مش موجود
    if (Create && !Paint.exists(selector)) {
        Paint(selector, ""); // ينشئ القاعدة في CSSInsertEngine
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
Paint.createSheet = function(CSSCode) {
    if (typeof CSSStyleSheet === "function" && CSSStyleSheet.prototype.replaceSync) {
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(CSSCode);
            return sheet;
        } catch (error) {
            console.warn("Failed to create constructed stylesheet:", error);
        }
    } else {
    	// Fallback
  let Parser = new DOMParser();
	let DOM = Parser.parseFromString(`
	<style id="fallback">${CSSCode}</style>
	`,"text/html");
	return DOM.querySelector("style").sheet;
  }
};
Paint.setSheet = function(sheet) {
    window.CSSInsertEngine = sheet;
    window.CSSEngine = document.styleSheets;
};
Paint.insertMany = async function(CSSCode) {
	Paint.createSheet(CSSCode).cssRules.forEach((rule,index)=>{
		Paint.addRule(CSSInsertEngine,rule.cssText);
	});
};
Paint.findQuire = function(condition) {
  let query = String(condition).replace(/[()\s]/g,"");
  let XyRule = null;

  Array.from(document.styleSheets).forEach(sheet => {
    Array.from(sheet.cssRules).forEach(rule => {
      // شوف لو rule فيه containerName أو conditionText
      let q = rule.containerName ?? rule.conditionText ?? null;
      if (!q) return;

      let ruleCond = String(q).replace(/[()\s]/g,"");
      if(ruleCond === query) XyRule = rule;
    });
  });

  return XyRule;
};
Paint.restore = function (){
window.CSSInsertEngine = sheetX;
window.CSSEngine = document.styleSheets;
console.log(`All defaults are reset`);
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
Paint.Proxy = function(obj) {
  const PaintProxy = new Proxy(Paint, {
  // Watch function calls
  apply(target, thisArg, args) {
    obj.onChange('🎨 Paint called with:', args);
    const result = target.apply(thisArg, args);
    obj.onChange('🎨 Paint returned:', result);
    return result;
  },
  
  // Watch property access
  get(target, prop) {
    obj.onChange('👀 Accessing Paint.' + prop);
    return target[prop];
  },
  
  // Watch property changes
  set(target, prop, value) {
    obj.onChange('✏️ Setting Paint.' + prop + ' =', value);
    target[prop] = value;
    return true;
  }
});

// Replace original Paint with proxied version
window.Paint = PaintProxy;

console.log("Proxy....");
};
window.Paint = Paint;                                               };
                                            }
                                            if (prop === 'removeProperty') {
                                                return function(property) {
                                                    log(`🗑️ removeProperty: ${property}`);
                                                    return target.removeProperty(property);
                                                };
                                            }
                                            return target[prop];
                                        }
                                    });
                                    
                                    // Replace the style object (this is tricky and might not work in all browsers)
                                    try {
                                        Object.defineProperty(rule, 'style', {
                                            value: proxiedStyle,
                                            writable: false
                                        });
                                    } catch (e) {
                                       // log(`⚠️ Could not proxy rule ${ruleIndex} style`);
                                    }
                                }
                            });
                            
                           // log(`✅ Watching stylesheet ${sheetIndex} with ${rules.length} rules`);
                            
                        } catch (e) {
        //                    log(`⚠️ Cannot access stylesheet ${sheetIndex}: ${e.message}`);
                        }
                    });

                    // Also monitor dynamic style changes via MutationObserver
                    

                    this.watchers.add(observer);
//                    log('🔍 CSS Watcher initialized!');
                    
                } catch (error) {
  //                  log(`❌ Error initializing watcher: ${error.message}`);
                }
            },
            unwatch: function() {
                this.watchers.forEach(watcher => {
                    if (watcher.disconnect) watcher.disconnect();
                });
                this.watchers.clear();
                console.log('🛑 CSS Watcher stopped');
            }
};
Paint.restore = function (){
window.CSSInsertEngine = sheetX;
window.CSSEngine = document.styleSheets;
console.log(`All defaults are reset`);
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
window.Paint=Paint;

tailwind.config = {
      theme: {
        extend: {
          colors: {
            'brk-dark':    '#0f0f0f',
            'brk-darker':  '#080808',
            'brk-card':    '#1a1a1a',
            'brk-card2':   '#212121',
            'brk-border':  '#2a2a2a',
            'brk-orange':  '#f97316',
            'brk-orange2': '#ea6c0a',
            'brk-muted':   '#888888',
            'brk-light':   '#d4d4d4',
          },
          fontFamily: {
            bebas: ['"Bebas Neue"', 'cursive'],
            dm:    ['"DM Sans"', 'sans-serif'],
          },
        }
      }
    };

(function(){
  var params=new URLSearchParams(window.location.search);
  var fields={};
  var paramMap={
    'first_name':'firstName','last_name':'lastName','full_name':'fullName',
    'email':'email','phone':'phone','company':'company',
    'city':'city','state':'state','country':'country'
  };
  var skipTags={'SCRIPT':1,'STYLE':1,'NOSCRIPT':1,'TEXTAREA':1,'CODE':1,'PRE':1};
  var hasUrlFields=false;
  for(var p in paramMap){
    var v=params.get(p);
    if(v){fields[paramMap[p]]=v;hasUrlFields=true;}
  }
  var contactId=params.get('contact_id');
  function esc(s){
    if(!s)return s;
    var d=document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }
  function doReplace(data){
    var r={};
    r['{{full_name}}']=esc(((data.firstName||'')+' '+(data.lastName||'')).trim()||((data.fullName||data.name)||''));
    r['{{first_name}}']=esc(data.firstName||(data.name?data.name.split(' ')[0]:'')||'');
    r['{{last_name}}']=esc(data.lastName||(data.name&&data.name.indexOf(' ')>-1?data.name.substring(data.name.indexOf(' ')+1):'')||'');
    r['{{email}}']=esc(data.email||'');
    r['{{phone}}']=esc(data.phone||'');
    r['{{company}}']=esc(data.company||'');
    r['{{city}}']=esc(data.city||'');
    r['{{state}}']=esc(data.state||'');
    r['{{country}}']=esc(data.country||'');
    r['{{date}}']=new Date().toLocaleDateString();
    r['{{time}}']=new Date().toLocaleTimeString();
    r['{{location}}']=[data.city,data.state,data.country].filter(Boolean).join(', ');
    r['{{tracking_id}}']=esc(data.trackingId||'');
    r['{{lastClickedProduct}}']=esc(data.lastClickedProduct||'');
    r['{{lastProductClickDate}}']=esc(data.lastProductClickDate||'');
    r['{{lastClickedProductPrice}}']=esc(data.lastClickedProductPrice||'');
    r['{{lastClickedProductURL}}']=esc(data.lastClickedProductURL||'');
    r['{{productsClickedCount}}']=esc(data.productsClickedCount||'0');
    r['{{ip_address}}']=esc(data.ipAddress||'');
    r['{{ip}}']=esc(data.ipAddress||'');
    if(data.customFields){
      for(var k in data.customFields){
        r['{{'+k+'}}']=esc(String(data.customFields[k]||''));
      }
    }
    params.forEach(function(v,k){
      if(!paramMap[k]&&k!=='contact_id'&&k!=='page_id'&&k.indexOf('utm_')!==0){
        r['{{'+k+'}}']=esc(v);
      }
    });
    var hasValues=false;
    for(var key in r){if(r[key]){hasValues=true;break;}}
    if(!hasValues)return;
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode:function(n){
        var p=n.parentNode;
        if(p&&skipTags[p.nodeName])return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while(node=walker.nextNode()){
      var txt=node.nodeValue;
      if(txt&&txt.indexOf('{{')>-1){
        var changed=txt;
        for(var ph in r){
          if(r[ph]&&changed.indexOf(ph)>-1){
            changed=changed.split(ph).join(r[ph]);
          }
        }
        if(changed!==txt)node.nodeValue=changed;
      }
    }
    var attrs=['value','placeholder','content','alt','title'];
    attrs.forEach(function(attr){
      var els=document.querySelectorAll('['+attr+'*="{{"]');
      for(var i=0;i<els.length;i++){
        var tag=els[i].tagName;
        if(skipTags[tag])continue;
        var val=els[i].getAttribute(attr);
        if(val){
          var nv=val;
          for(var ph in r){
            if(r[ph]&&nv.indexOf(ph)>-1){
              nv=nv.split(ph).join(r[ph]);
            }
          }
          if(nv!==val)els[i].setAttribute(attr,nv);
        }
      }
    });
  }
  function run(){
    if(contactId){
      var xhr=new XMLHttpRequest();
      xhr.open('GET','https://paymegpt.com/api/landing/context/'+encodeURIComponent(contactId)+'?page_id=2216');
      xhr.onload=function(){
        if(xhr.status===200){
          try{
            var resp=JSON.parse(xhr.responseText);
            if(resp.success&&resp.contact){
              var merged=resp.contact;
              for(var k in fields){merged[k]=fields[k];}
              doReplace(merged);
              return;
            }
          }catch(e){}
        }
        if(hasUrlFields)doReplace(fields);
      };
      xhr.onerror=function(){if(hasUrlFields)doReplace(fields);};
      xhr.send();
    }else if(hasUrlFields){
      doReplace(fields);
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}
  else{run();}
})();

// ===== NAVIGATION: SCROLL SHADOW ON SCROLL =====
    // Adds 'scrolled' class to nav when user scrolls past threshold
    // Triggers: window scroll event
    (function() {
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      function handleNavScroll() {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }

      window.addEventListener('scroll', handleNavScroll, { passive: true });
      handleNavScroll(); // Run on load
    })();

    // ===== MOBILE MENU TOGGLE =====
    // Function: toggleMobileMenu()
    // Purpose: Show/hide mobile navigation dropdown
    // Triggers: Click on hamburger button
    (function() {
      const btn  = document.getElementById('mobile-menu-btn');
      const menu = document.getElementById('mobile-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', function() {
        const isOpen = menu.classList.contains('open');
        menu.classList.toggle('open');
        btn.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(!isOpen));
      });

      // Close mobile menu when a link is clicked
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          menu.classList.remove('open');
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    })();

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    // Purpose: Override default anchor behavior with smooth scroll + offset for sticky nav
    // Triggers: Click on any anchor href starting with #
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const navHeight = document.getElementById('main-nav').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });

    // ===== INTERSECTION OBSERVER: SCROLL REVEAL =====
    // Purpose: Animate elements into view when they enter the viewport
    // Watches: .reveal, .reveal-left, .reveal-right, .reveal-scale elements
    // Triggers: IntersectionObserver with 15% threshold
    (function() {
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      if (!revealElements.length) return;

      const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // Only animate once
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(function(el) {
        revealObserver.observe(el);
      });
    })();

    // ===== COUNTER ANIMATION =====
    // Function: animateCounter(element, target, suffix, duration)
    // Purpose: Animate number from 0 to target value with easing
    // Triggers: IntersectionObserver when stats section enters viewport
    // Uses: requestAnimationFrame for smooth 60fps animation
    (function() {
      const counters = document.querySelectorAll('.counter');
      if (!counters.length) return;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function animateCounter(el, target, suffix, duration) {
        const start    = performance.now();
        const startVal = 0;

        function update(currentTime) {
          const elapsed  = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = easeOutQuart(progress);
          const current  = Math.round(startVal + (target - startVal) * eased);

          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
      }

      // Observe when counter section enters viewport
      const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const el     = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix, 2000);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function(counter) {
        counterObserver.observe(counter);
      });
    })();

    // ===== CONTACT FORM HANDLER =====
    // Function: handleContactFormSubmit(e)
    // Purpose: Validate form fields and show success/error states
    // Triggers: Form submit event
    // Note: Replace with real backend integration or CRM webhook as needed
    (function() {
      const form    = document.getElementById('contact-form');
      const success = document.getElementById('form-success');
      const error   = document.getElementById('form-error');
      const btn     = document.getElementById('form-submit-btn');
      if (!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous messages
        success.classList.add('hidden');
        error.classList.add('hidden');

        // Validate required fields
        const name  = form.querySelector('[name="full_name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();

        if (!name || !phone || !email) {
          error.classList.remove('hidden');
          error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }

        // Simulate loading state on button
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<svg class="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="4"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="white"/></svg> Sending...';

        // Simulate async submission (replace with real API call)
        setTimeout(function() {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          success.classList.remove('hidden');
          form.reset();
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
      });
    })();

    // ===== SERVICE CARD HOVER ENHANCEMENT =====
    // Purpose: Add subtle tilt effect to service cards on mouse move
    // Triggers: mousemove and mouseleave events on service cards
    (function() {
      const cards = document.querySelectorAll('.service-card');
      cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          const rect    = card.getBoundingClientRect();
          const x       = e.clientX - rect.left;
          const y       = e.clientY - rect.top;
          const centerX = rect.width  / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4;
          const rotateY = ((x - centerX) / centerX) *  4;
          card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = '';
        });
      });
    })();
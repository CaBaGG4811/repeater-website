var CATS=['Все','Математика','Русский','Физика','Английский','Техники','Другое'];
var STAGES=[0,1,3,7,15,30];
var WD=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
var COLORS=['#FF6B6B','#34C759','#4DABF7','#FFB800','#A78BFA','#F97316','#EC4899'];

var POSTS=[
{id:1,title:'Метод интервального повторения',cat:'Техники обучения',icon:'I',time:5,diff:'Средний',
content:'<h2>Что такое интервальное повторение?</h2><p>Техника обучения, при которой информация повторяется через возрастающие интервалы времени.</p><h2>Алгоритм SM-2</h2><ul><li>После успешного повторения интервал увеличивается</li><li>Интервалы: 1, 3, 7, 14, 30 дней</li></ul><p>Мозг лучше запоминает информацию в момент, когда она начинает забываться.</p>',
act:'create_topic',data:'Интервальное повторение'},
{id:2,title:'Метод Помидора',cat:'Техники обучения',icon:'P',time:3,diff:'Легкий',
content:'<h2>Как работать</h2><ol><li>Выберите задачу</li><li>Поставьте таймер на 25 минут</li><li>Работайте без отвлечений</li><li>Перерыв 5 минут</li><li>После 4 циклов — 15-30 мин отдыха</li></ol>',
act:'open_timer',data:''},
{id:3,title:'Метод Фейнмана',cat:'Техники обучения',icon:'F',time:4,diff:'Легкий',
content:'<h2>4 шага</h2><ol><li><strong>Выберите тему</strong></li><li><strong>Объясните просто</strong> — как ребёнку</li><li><strong>Найдите пробелы</strong></li><li><strong>Упростите</strong></li></ol><p>Не можете объяснить просто — недостаточно понимаете.</p>',
act:'create_topic',data:'Метод Фейнмана'},
{id:4,title:'Матрица Эйзенхауэра',cat:'Планирование',icon:'E',time:3,diff:'Легкий',
content:'<h2>4 квадрата</h2><ul><li><strong>Важно + Срочно</strong> — немедленно</li><li><strong>Важно + Не срочно</strong> — запланировать</li><li><strong>Не важно + Срочно</strong> — делегировать</li><li><strong>Не важно + Не срочно</strong> — удалить</li></ul>',
act:'open_link',data:'https://ru.wikipedia.org/wiki/Matrix_of_Eisenhower'},
{id:5,title:'Правило 80/20',cat:'Планирование',icon:'8',time:3,diff:'Легкий',
content:'<h2>Принцип Парето</h2><p>20% усилий дают 80% результата.</p><ul><li>20% материала = 80% ответов на экзамене</li><li>20% слов = 80% речи</li></ul>',
act:'create_topic',data:'Правило Парето'},
{id:6,title:'Тетрадь ошибок',cat:'Техники обучения',icon:'T',time:4,diff:'Легкий',
content:'<h2>Как вести</h2><ol><li>Запишите задачу</li><li>Неправильный ответ</li><li>Правильный ответ</li><li>Через неделю повторите</li></ol>',
act:'create_topic',data:'Тетрадь ошибок'},
{id:7,title:'Как выучить 50 слов',cat:'Языки',icon:'W',time:5,diff:'Средний',
content:'<h2>Система</h2><ul><li>Утром 20 мин — изучите 50 слов</li><li>В обед, вечером и перед сном — повторите</li><li>Через 1, 3 и 7 дней — закрепите</li></ul>',
act:'create_topic',data:'Учить 50 слов'}
];

var topics=JSON.parse(localStorage.getItem('topics')||'[]');
var selCat='Все',selModCat='Другое',selPostCat='Все';

function save(){localStorage.setItem('topics',JSON.stringify(topics))}
function genId(){return topics.length>0?Math.max.apply(null,topics.map(function(t){return t.id}))+1:1}
function stageInt(s){return STAGES[Math.min(s,5)]}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function fmtDate(ts){return new Date(ts).toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'})}

function intLabel(t){
    if(t.done)return'\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e';
    var n=Date.now();
    if(t.nr<=n)return t.st===0?'\u0421\u0435\u0439\u0447\u0430\u0441':'\u041f\u0440\u043e\u0441\u0440\u043e\u0447\u0435\u043d\u043e';
    var d=Math.ceil((t.nr-n)/864e5);
    if(d<=0)return'\u0421\u0435\u0433\u043e\u0434\u043d\u044f';if(d===1)return'\u0417\u0430\u0432\u0442\u0440\u0430';return d+' \u0434\u043d.';
}
function sClass(t){return t.done?'topic--done':t.st===0?'topic--new':'topic--active'}
function bClass(t){return t.done?'topic__badge--done':(!t.done&&t.st>0&&t.nr<=Date.now())?'topic__badge--overdue':'topic__badge--interval'}
function isOvr(t){return!t.done&&t.st>0&&t.nr<=Date.now()}
function catTitle(t){
    var l=t.toLowerCase();
    if(/\u043a\u043e\u0440\u043d|\u043a\u0432\u0430\u0434\u0440\u0430\u0442|\u0443\u0440\u0430\u0432\u043d\u0435\u043d|\u0444\u043e\u0440\u043c\u0443\u043b|\u0447\u0438\u0441\u043b|\u043c\u0430\u0442\u0435\u043c|\u0430\u043b\u0433\u0435\u0431\u0440|\u0433\u0435\u043e\u043c\u0435\u0442\u0440|\u043f\u0440\u0438\u043c\u0435\u0440/.test(l))return'\u041c\u0430\u0442\u0435\u043c\u0430\u0442\u0438\u043a\u0430';
    if(/\u0433\u043b\u0430\u0433\u043e\u043b|\u043f\u0440\u0435\u0434\u043b\u043e\u0436|\u0442\u0435\u043a\u0441\u0442|\u0433\u0440\u0430\u043c\u043e\u0442|\u0440\u0443\u0441\u0441\u043a|\u043b\u0438\u0442\u0435\u0440\u0430\u0442|\u0441\u0442\u0438\u0445/.test(l))return'\u0420\u0443\u0441\u0441\u043a\u0438\u0439';
    if(/\u0444\u0438\u0437\u0438\u043a|\u043c\u0435\u0445\u0430\u043d\u0438\u043a|\u044d\u043b\u0435\u043a\u0442\u0440\u0438\u043c\u0430\u0433\u043d\u0438\u0442|\u0441\u043a\u043e\u0440\u043e\u0441\u0442/.test(l))return'\u0424\u0438\u0437\u0438\u043a\u0430';
    if(/\u0430\u043d\u0433\u043b|english|word|verb/.test(l))return'\u0410\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438\u0439';
    if(/\u043c\u0435\u0442\u043e\u0434|\u0442\u0435\u0445\u043d\u0438\u043a|\u0444\u0435\u0439\u043d\u043c\u0430\u043d|\u043f\u043e\u043c\u0438\u0434\u043e\u0440|\u043f\u043e\u0432\u0442\u043e\u0440|\u043f\u043b\u0430\u043d|\u0437\u0430\u0434\u0430\u0447|\u0432\u0440\u0435\u043c\u044f/.test(l))return'\u0422\u0435\u0445\u043d\u0438\u043a\u0438';
    return'\u0414\u0440\u0443\u0433\u043e\u0435';
}
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('active');clearTimeout(t._);t._=setTimeout(function(){t.classList.remove('active')},2800)}

// Nav
function showScreen(n){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('screen--active')});
    var el=document.getElementById('screen-'+n);if(el)el.classList.add('screen--active');
    document.querySelectorAll('.sidebar__btn').forEach(function(b){b.classList.remove('sidebar__btn--active')});
    var b=document.querySelector('[data-screen="'+n+'"]');if(b)b.classList.add('sidebar__btn--active');
    if(n==='dashboard')renderDash();if(n==='topics')renderTopics();
    if(n==='posts')renderPosts();if(n==='stats')renderStats();if(n==='settings')renderSet();
    document.getElementById('scroll-area').scrollTop=0;
    setTimeout(initReveal,100);
}
document.querySelectorAll('.sidebar__btn').forEach(function(b){b.addEventListener('click',function(){showScreen(b.dataset.screen)})});
document.querySelectorAll('.sidebar__settings').forEach(function(b){b.addEventListener('click',function(){showScreen(b.dataset.screen)})});

// Search
document.getElementById('search-input').addEventListener('input',function(){filterBySearch(this.value)});

// Scroll Reveal
function initReveal(){
    var reveals=document.querySelectorAll('.reveal:not(.revealed)');
    if(!reveals.length)return;
    if(!('IntersectionObserver' in window)){reveals.forEach(function(el){el.classList.add('revealed')});return}
    var obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}});
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){obs.observe(el)});
}

// Dashboard
function renderDash(){
    var h=new Date().getHours();
    var g=h<12?'\u0414\u043e\u0431\u0440\u043e\u0435 \u0443\u0442\u0440\u043e':h<18?'\u0414\u043e\u0431\u0440\u044b\u0439 \u0434\u0435\u043d\u044c':'\u0414\u043e\u0431\u0440\u044b\u0439 \u0432\u0435\u0447\u0435\u0440';
    document.getElementById('greeting').textContent=g+', \u0421\u0430\u0432\u0435\u043b\u0438\u0439!';
    renderBubbles();renderCal();renderSteps();renderHabits();renderWeekly();renderStreak();
    setTimeout(initReveal,50);
}

function renderBubbles(){
    var tot=topics.length,done=topics.filter(function(t){return t.done}).length;
    var act=tot-done,due=topics.filter(function(t){return!t.done&&t.nr<=Date.now()}).length;
    var rate=tot>0?Math.round(done/tot*100):0;

    var bs=[
        {val:rate+'%',lbl:'\u0413\u043e\u0442\u043e\u0432\u043d\u043e\u0441\u0442\u044c',cls:'bub--dark',sz:140,x:'calc(50% - 70px)',y:'30px',z:3},
        {val:act,lbl:'\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0445',cls:'bub--sun',sz:170,x:'calc(50% + 30px)',y:'0px',z:1},
        {val:due,lbl:'\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c',cls:'bub--red',sz:100,x:'calc(50% - 130px)',y:'100px',z:2}
    ];

    document.getElementById('bubbles-area').innerHTML=bs.map(function(b,i){
        return'<div class="bub '+b.cls+'" style="width:'+b.sz+'px;height:'+b.sz+'px;font-size:'+(b.sz>100?22:16)+'px;left:'+b.x+';top:'+b.y+';z-index:'+b.z+';animation:bubIn .7s var(--ease) '+(i*.2)+'s both"><div class="bub__value">'+b.val+'</div><div class="bub__label">'+b.lbl+'</div></div>';
    }).join('');

    document.getElementById('bubble-legend').innerHTML=[
        {c:'var(--color-coral)',l:'\u041f\u0440\u043e\u0441\u0440\u043e\u0447\u0435\u043d\u043e: '+due},
        {c:'var(--color-yellow)',l:'\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0445: '+act},
        {c:'var(--color-green)',l:'\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e: '+done}
    ].map(function(i){return'<div class="bubbles__legend-item"><div class="bubbles__legend-dot" style="background:'+i.c+'"></div>'+i.l+'</div>'}).join('');
}

function renderCal(){
    var now=new Date(),y=now.getFullYear(),m=now.getMonth(),td=now.getDate();
    var fd=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
    var mn=['\u042f\u043d\u0432\u0430\u0440\u044c','\u0424\u0435\u0432\u0440\u0430\u043b\u044c','\u041c\u0430\u0440\u0442','\u0410\u043f\u0440\u0435\u043b\u044c','\u041c\u0430\u0439','\u0418\u044e\u043d\u044c','\u0418\u044e\u043b\u044c','\u0410\u0432\u0433\u0443\u0441\u0442','\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c','\u041e\u043a\u0442\u044f\u0431\u0440\u044c','\u041d\u043e\u044f\u0431\u0440\u044c','\u0414\u0435\u043a\u0430\u0431\u0440\u044c'];
    document.getElementById('cal-month').textContent=mn[m]+' '+y;
    var dd={};
    topics.forEach(function(t){if(!t.done){var d=new Date(t.nr);if(d.getMonth()===m&&d.getFullYear()===y)dd[d.getDate()]=true}});
    var h=WD.map(function(d){return'<div class="calendar__day-label">'+d+'</div>'}).join('');
    for(var i=0;i<fd;i++)h+='<div class="calendar__day calendar__day--empty"></div>';
    for(var d=1;d<=dim;d++){var c='calendar__day';if(d===td)c+=' calendar__day--today';else if(dd[d])c+=' calendar__day--due';h+='<div class="'+c+'">'+d+'</div>'}
    document.getElementById('cal-grid').innerHTML=h;
}

function renderSteps(){
    var due=topics.filter(function(t){return!t.done&&t.nr<=Date.now()});
    var tot=due.length,don=0;
    due.forEach(function(t){if(t.st>0)don++});
    var pct=tot>0?don/tot:0;
    document.getElementById('steps-done').textContent=don;
    document.getElementById('steps-total').textContent=tot;
    var circ=2*Math.PI*42;
    var ring=document.getElementById('ring-progress');
    ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ;
    setTimeout(function(){ring.style.strokeDashoffset=circ*(1-pct)},100);
}

function renderHabits(){
    var recent=topics.filter(function(t){return!t.done}).slice(0,6);
    if(!recent.length){document.getElementById('habits-list').innerHTML='<div style="text-align:center;padding:28px;color:var(--color-text-tertiary);font-size:12px">\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0442\u0435\u043c\u044b</div>';return}
    document.getElementById('habits-list').innerHTML=recent.map(function(t,i){
        var c=COLORS[i%COLORS.length],pct=Math.min(t.st/5*100,100);
        var bars='';for(var j=0;j<5;j++)bars+='<div class="habit__bar" style="width:'+(j<Math.ceil(pct/20)?'100%':'20%')+';background:'+(j<Math.ceil(pct/20)?c:'rgba(26,26,26,.08)')+'"></div>';
        return'<div class="habit" role="listitem"><div class="habit__icon" style="background:'+c+'">'+t.title.charAt(0).toUpperCase()+'</div><div class="habit__info"><div class="habit__name">'+esc(t.title)+'</div><div class="habit__meta">'+t.cat+' &middot; '+intLabel(t)+'</div><div class="habit__bars">'+bars+'</div></div><div class="habit__actions"><button class="habit__btn habit__btn--ok" onclick="reviewTopic('+t.id+')" title="\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u043b" aria-label="\u041e\u0442\u043c\u0435\u0442\u0438\u0442\u044c \u043a\u0430\u043a \u043f\u043e\u0432\u0442\u043e\u0440\u0451\u043d\u043d\u043e\u0435">&#10003;</button><button class="habit__btn habit__btn--delete" onclick="deleteTopic('+t.id+')" title="\u0423\u0434\u0430\u043b\u0438\u0442\u044c" aria-label="\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043c\u0443">&#10005;</button></div></div>';
    }).join('');
}

function renderWeekly(){
    var dc=[0,0,0,0,0,0,0];
    topics.forEach(function(t){if(t.rc>0){var d=new Date(t.dateAdded);dc[(d.getDay()+6)%7]+=(t.rc||1)}});
    var max=Math.max.apply(null,dc.concat([1]));
    var colors=['#FF6B6B','#FFB800','#34C759','#4DABF7','#A78BFA','#F97316','#EC4899'];
    document.getElementById('weekly-bars').innerHTML=WD.map(function(d,i){
        var h=Math.max(dc[i]/max*90,4);
        return'<div class="weekly__col"><div class="weekly__count">'+dc[i]+'</div><div class="weekly__bar" style="height:'+h+'px;background:'+colors[i]+'"></div><div class="weekly__label">'+d+'</div></div>';
    }).join('');
}

function renderStreak(){
    var streak=0;
    var today=new Date();
    for(var i=0;i<30;i++){
        var day=new Date(today);
        day.setDate(day.getDate()-i);
        var hasReview=topics.some(function(t){
            var rd=new Date(t.dateAdded);
            return rd.toDateString()===day.toDateString()&&t.rc>0;
        });
        if(hasReview||i===0)streak++;
        else break;
    }
    document.getElementById('streak-val').textContent=streak;
    var days=['\u041f\u043d','\u0412\u0442','\u0421\u0440','\u0427\u0442','\u041f\u0442','\u0421\u0431','\u0412\u0441'];
    var todayIdx=(today.getDay()+6)%7;
    var html='';
    for(var i=0;i<7;i++){
        var cls=i<=todayIdx?(i===todayIdx?'streak__dot--today':'streak__dot--active'):'streak__dot--inactive';
        html+='<div class="streak__dot '+cls+'" role="listitem">'+days[i]+'</div>';
    }
    document.getElementById('streak-days').innerHTML=html;
}

// Topics
function renderTopics(){
    renderChips();
    var f=selCat==='\u0412\u0441\u0435'?topics:topics.filter(function(t){return t.cat===selCat});
    f.sort(function(a,b){return a.nr-b.nr});
    var due=topics.filter(function(t){return!t.done&&t.nr<=Date.now()}).length;
    document.getElementById('topics-subtitle').textContent=topics.length+' \u0442\u0435\u043c, '+due+' \u0442\u0440\u0435\u0431\u0443\u044e\u0442 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u044f';
    var list=document.getElementById('topics-list'),emp=document.getElementById('empty-topics');
    if(!f.length){list.innerHTML='';emp.style.display='block';return}
    emp.style.display='none';
    list.innerHTML=f.map(function(t,i){
        var sc=sClass(t),bc=bClass(t),o=isOvr(t);
        return'<div class="topic '+sc+(o?' topic--overdue':'')+'" role="listitem" style="animation-delay:'+(i*.04)+'s"><div class="topic__top"><div class="topic__name">'+esc(t.title)+'</div><div class="topic__badge '+bc+'">'+intLabel(t)+'</div></div><div class="topic__meta">'+t.cat+' &middot; '+fmtDate(t.dateAdded)+'</div><div class="topic__actions">'+(!t.done?'<button class="topic__btn topic__btn--review" onclick="reviewTopic('+t.id+')">\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u043b</button>':'')+'<button class="topic__btn topic__btn--delete" onclick="deleteTopic('+t.id+')">&#10005;</button></div></div>';
    }).join('');
}
function renderChips(){
    document.getElementById('topic-chips').innerHTML=CATS.map(function(c){return'<button class="chip'+(selCat===c?' chip--active':'')+'" onclick="selCat=\''+c+'\';renderTopics()">'+c+'</button>'}).join('');
}

function reviewTopic(id){
    var t=topics.find(function(x){return x.id===id});
    if(!t||t.done)return;
    t.st=Math.min(t.st+1,5);
    if(t.st>=5){t.done=true;toast('\u0422\u0435\u043c\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430!')}
    else{toast('\u041e\u0442\u043c\u0435\u0447\u0435\u043d\u043e. \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435: '+intLabel({st:t.st,nr:Date.now()+stageInt(t.st)*864e5,done:false}))}
    t.interval=stageInt(t.st);t.nr=Date.now()+t.interval*864e5;t.rc=(t.rc||0)+1;
    save();renderTopics();renderDash();
}
function deleteTopic(id){topics=topics.filter(function(t){return t.id!==id});save();renderTopics();renderDash();toast('\u0422\u0435\u043c\u0430 \u0443\u0434\u0430\u043b\u0435\u043d\u0430')}

// Add
function openAddTopicDialog(){
    document.getElementById('topic-title-input').value='';selModCat='\u0414\u0440\u0443\u0433\u043e\u0435';renderModChips();
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('add-topic-modal').classList.add('active');
    setTimeout(function(){document.getElementById('topic-title-input').focus()},100);
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('active');document.getElementById('add-topic-modal').classList.remove('active')}
function renderModChips(){
    var cs=CATS.filter(function(c){return c!=='\u0412\u0441\u0435'});
    document.getElementById('modal-category-chips').innerHTML=cs.map(function(c){return'<button class="chip'+(selModCat===c?' chip--active':'')+'" onclick="selModCat=\''+c+'\';renderModChips()">'+c+'</button>'}).join('');
}
document.getElementById('topic-title-input').addEventListener('input',function(){var a=catTitle(this.value);if(a!=='\u0414\u0440\u0443\u0433\u043e\u0435'){selModCat=a;renderModChips()}});
document.getElementById('topic-title-input').addEventListener('keydown',function(e){if(e.key==='Enter')saveTopic()});
function saveTopic(){
    var t=document.getElementById('topic-title-input').value.trim();
    if(!t){toast('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435');return}
    topics.push({id:genId(),title:t,cat:selModCat,dateAdded:Date.now(),nr:Date.now(),interval:0,st:0,done:false,rc:0});
    save();closeModal();renderTopics();renderDash();toast('\u0422\u0435\u043c\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430');
}
function filterBySearch(q){
    if(!q){renderTopics();return}
    var lq=q.toLowerCase();
    var f=topics.filter(function(t){return t.title.toLowerCase().indexOf(lq)!==-1||t.cat.toLowerCase().indexOf(lq)!==-1});
    var list=document.getElementById('topics-list'),emp=document.getElementById('empty-topics');
    if(!f.length){list.innerHTML='';emp.style.display='block';return}
    emp.style.display='none';
    list.innerHTML=f.map(function(t,i){var sc=sClass(t),bc=bClass(t),o=isOvr(t);
        return'<div class="topic '+sc+(o?' topic--overdue':'')+'" role="listitem"><div class="topic__top"><div class="topic__name">'+esc(t.title)+'</div><div class="topic__badge '+bc+'">'+intLabel(t)+'</div></div><div class="topic__meta">'+t.cat+' &middot; '+fmtDate(t.dateAdded)+'</div><div class="topic__actions">'+(!t.done?'<button class="topic__btn topic__btn--review" onclick="reviewTopic('+t.id+')">\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u043b</button>':'')+'<button class="topic__btn topic__btn--delete" onclick="deleteTopic('+t.id+')">&#10005;</button></div></div>';
    }).join('');
}

// Posts
function renderPosts(){
    var cs=['\u0412\u0441\u0435'];POSTS.forEach(function(p){if(cs.indexOf(p.cat)===-1)cs.push(p.cat)});
    document.getElementById('post-chips').innerHTML=cs.map(function(c){return'<button class="chip'+(selPostCat===c?' chip--active':'')+'" onclick="selPostCat=\''+c+'\';renderPosts()">'+c+'</button>'}).join('');
    var f=selPostCat==='\u0412\u0441\u0435'?POSTS:POSTS.filter(function(p){return p.cat===selPostCat});
    document.getElementById('posts-list').innerHTML=f.map(function(p,i){
        var c=COLORS[p.id%COLORS.length];
        return'<div class="post" onclick="openPost('+p.id+')" role="listitem" style="animation:fadeInUp .4s var(--ease) '+(i*.06)+'s both"><div class="post__icon" style="background:'+c+'">'+p.icon+'</div><div class="post__title">'+esc(p.title)+'</div><div class="post__meta"><span>'+p.cat+'</span><span>'+p.time+' \u043c\u0438\u043d</span><span>'+p.diff+'</span></div></div>';
    }).join('');
}
function openPost(id){
    var p=POSTS.find(function(x){return x.id===id});if(!p)return;
    var c=COLORS[p.id%COLORS.length];
    var lb={create_topic:'\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0442\u0435\u043c\u0443',open_timer:'\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c Pomodoro',open_link:'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443'};
    document.getElementById('post-detail-content').innerHTML='<div class="post-detail__header"><div class="post-detail__icon" style="background:'+c+'">'+p.icon+'</div><div class="post-detail__title">'+esc(p.title)+'</div><div class="post-detail__meta"><span>'+p.cat+'</span><span>'+p.time+' \u043c\u0438\u043d</span><span>'+p.diff+'</span></div></div><div class="post-detail__body">'+p.content+'</div><button class="btn--full" onclick="handleAct(\''+p.act+'\',\''+esc(p.data).replace(/'/g,"\\'")+'\')">'+lb[p.act]+'</button>';
    showScreen('post-detail');
}
function handleAct(type,data){
    if(type==='create_topic'){selModCat=catTitle(data);document.getElementById('topic-title-input').value=data;renderModChips();document.getElementById('modal-overlay').classList.add('active');document.getElementById('add-topic-modal').classList.add('active');setTimeout(function(){document.getElementById('topic-title-input').focus()},100)}
    else if(type==='open_timer')toast('Pomodoro: 25 \u043c\u0438\u043d - 5 \u043c\u0438\u043d \u043e\u0442\u0434\u044b\u0445\u0430 - 4 \u0446\u0438\u043a\u043b\u0430');
    else if(type==='open_link')window.open(data,'_blank');
}

// Stats
function renderStats(){
    var tot=topics.length,done=topics.filter(function(t){return t.done}).length,act=tot-done;
    var rate=tot>0?Math.round(done/tot*100):0;
    var due=topics.filter(function(t){return!t.done&&t.nr<=Date.now()}).length;
    var at=topics.filter(function(t){return!t.done&&t.st>0});
    var avg=at.length>0?Math.round(at.reduce(function(s,t){return s+t.interval},0)/at.length):0;

    document.getElementById('stats-layout').innerHTML=
        '<div class="stats__hero"><div class="stats__hero-label">\u0413\u043e\u0442\u043e\u0432\u043d\u043e\u0441\u0442\u044c</div><div class="stats__hero-value">'+rate+'<span class="stats__hero-unit">%</span></div><div class="stats__hero-sub">'+(due>0?due+' \u0442\u0435\u043c \u0442\u0440\u0435\u0431\u0443\u044e\u0442 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u044f':'\u0412\u0441\u0435 \u0442\u0435\u043c\u044b \u0438\u0437\u0443\u0447\u0435\u043d\u044b')+'</div></div>'+
        '<div class="stats__card"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg><div class="stats__card-value" style="color:var(--color-blue)">'+tot+'</div><div class="stats__card-label">\u0412\u0441\u0435\u0433\u043e \u0442\u0435\u043c</div></div>'+
        '<div class="stats__card"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><div class="stats__card-value" style="color:var(--color-green)">'+done+'</div><div class="stats__card-label">\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e</div></div>'+
        '<div class="stats__wide"><h3>\u041f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u044f \u043f\u043e \u0434\u043d\u044f\u043c</h3><canvas id="week-chart"></canvas></div>';

    var dc=[0,0,0,0,0,0,0];
    topics.forEach(function(t){if(t.rc>0){var d=new Date(t.dateAdded);dc[(d.getDay()+6)%7]+=(t.rc||1)}});
    setTimeout(function(){drawChart(dc)},50);
}
function drawChart(data){
    var cv=document.getElementById('week-chart');if(!cv)return;
    var ctx=cv.getContext('2d'),dpr=window.devicePixelRatio||1,rect=cv.getBoundingClientRect();
    cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
    var w=rect.width,h=rect.height,max=Math.max.apply(null,data.concat([1]));
    var bw=(w-50)/7,ch=h-40;
    ctx.clearRect(0,0,w,h);
    data.forEach(function(v,i){
        var x=30+bw*i+bw*.2,bwb=bw*.6,bh=Math.max(v/max*(ch-8),2),y=8+ch-bh;
        var g=ctx.createLinearGradient(x,y,x,8+ch);g.addColorStop(0,'#1A1A1A');g.addColorStop(1,'#C4B9A8');
        ctx.fillStyle=g;ctx.beginPath();
        var r=Math.min(bwb/2,4);ctx.moveTo(x+r,y);ctx.lineTo(x+bwb-r,y);ctx.quadraticCurveTo(x+bwb,y,x+bwb,y+r);
        ctx.lineTo(x+bwb,8+ch);ctx.lineTo(x,8+ch);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.fill();
        if(v>0){ctx.fillStyle='#1A1A1A';ctx.font='600 11px Plus Jakarta Sans';ctx.textAlign='center';ctx.fillText(v,x+bwb/2,y-6)}
        ctx.fillStyle='#8A7E6B';ctx.font='11px Plus Jakarta Sans';ctx.textAlign='center';ctx.fillText(WD[i],x+bwb/2,h-6);
    });
}

// Settings
function renderSet(){document.getElementById('notif-toggle').checked=localStorage.getItem('notifications')==='true'}
document.getElementById('notif-toggle').addEventListener('change',function(){localStorage.setItem('notifications',this.checked);toast(this.checked?'\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u044b':'\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u044b')});
function exportData(){var b=new Blob([JSON.stringify(topics,null,2)],{type:'application/json'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='repeater_'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);toast('\u0424\u0430\u0439\u043b \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d')}
function importData(ev){var f=ev.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){try{var imp=JSON.parse(e.target.result);if(!Array.isArray(imp))throw 0;imp.forEach(function(t){t.id=genId();t.dateAdded=t.dateAdded||Date.now();t.nr=t.nr||Date.now();t.st=t.st||0;t.interval=t.interval||0;t.done=t.done||false;t.rc=t.rc||0;topics.push(t)});save();renderTopics();renderDash();toast('\u0418\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043e '+imp.length+' \u0442\u0435\u043c')}catch(e){toast('\u041e\u0448\u0438\u0431\u043a\u0430 \u0444\u043e\u0440\u043c\u0430\u0442\u0430')}};r.readAsText(f);ev.target.value=''}
function clearAllData(){if(confirm('\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435 \u0442\u0435\u043c\u044b?')){topics=[];save();renderTopics();renderDash();toast('\u0414\u0430\u043d\u043d\u044b\u0435 \u0443\u0434\u0430\u043b\u0435\u043d\u043y')}}

// Modal overlay click
document.getElementById('modal-overlay').addEventListener('click',closeModal);

// Init
renderDash();

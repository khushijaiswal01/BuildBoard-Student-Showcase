const STORAGE_KEY = "buildboard-projects-v1";
const starterProjects = [
  {id:"demo-1",title:"Campus Connect",author:"Aarav",category:"Web Development",url:"",description:"A student hub to discover campus events, clubs and useful college resources in one place.",tags:["HTML","CSS","JavaScript"],likes:3,likedBy:[],comments:[{author:"Mira",text:"Nice idea! Consider adding an event calendar."}],createdAt:"2026-10-01T10:00:00.000Z"},
  {id:"demo-2",title:"Study Buddy AI",author:"Mira",category:"AI / Machine Learning",url:"",description:"A learning assistant concept that organizes notes and creates revision questions for students.",tags:["Python","AI"],likes:5,likedBy:[],comments:[],createdAt:"2026-10-02T10:00:00.000Z"},
  {id:"demo-3",title:"Expense Tracker",author:"Dev",category:"App Development",url:"",description:"A simple way to record everyday expenses, group them by category and understand spending patterns.",tags:["JavaScript","Productivity"],likes:2,likedBy:[],comments:[],createdAt:"2026-10-03T10:00:00.000Z"}
];
let projects = loadProjects();
let activeCommentProjectId = null;
const $ = id => document.getElementById(id);
function loadProjects(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):starterProjects;}catch{return starterProjects;}}
function saveProjects(){localStorage.setItem(STORAGE_KEY,JSON.stringify(projects));}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function safeURL(value){try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function renderProjects(){
 const query=$("search").value.trim().toLowerCase(), category=$("filterCategory").value, sort=$("sort").value;
 let shown=projects.filter(p=>(!category||p.category===category)&&[p.title,p.description,p.author,p.category,...p.tags].join(" ").toLowerCase().includes(query));
 shown.sort((a,b)=>sort==="popular"?b.likes-a.likes:new Date(b.createdAt)-new Date(a.createdAt));
 $("projectCount").textContent=projects.length;$("resultCount").textContent=`${shown.length} result${shown.length===1?"":"s"}`;
 $("emptyState").hidden=shown.length!==0;
 $("projectList").innerHTML=shown.map(p=>`<article class="project-card">
  <div class="card-top"><span class="category-pill">${escapeHTML(p.category)}</span><span class="card-date">${new Date(p.createdAt).toLocaleDateString()}</span></div>
  <h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p>
  <div class="tag-row">${p.tags.map(t=>`<span class="tag">#${escapeHTML(t)}</span>`).join("")}</div>
  ${safeURL(p.url)?`<a class="project-link" href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">View project ↗</a>`:""}
  <div class="card-author">Shared by ${escapeHTML(p.author)}</div>
  <div class="card-actions"><button class="like-btn" data-like="${p.id}" aria-label="Upvote ${escapeHTML(p.title)}">♥ ${p.likes} Upvote</button><button class="secondary-btn" data-comments="${p.id}">Comments (${p.comments.length})</button></div>
 </article>`).join("");
}
$("projectForm").addEventListener("submit",e=>{
 e.preventDefault();
 const title=$("title").value.trim(),author=$("author").value.trim(),category=$("category").value,description=$("description").value.trim(),url=$("url").value.trim();
 if(!title||!author||!category||!description){$("formMessage").textContent="Please complete all required fields.";return;}
 if(url&&!safeURL(url)){$("formMessage").textContent="Enter a valid http(s) project URL or leave it blank.";return;}
 const tags=$("tags").value.split(",").map(t=>t.trim()).filter(Boolean).slice(0,8);
 projects.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,author,category,description,url,tags,likes:0,likedBy:[],comments:[],createdAt:new Date().toISOString()});
 saveProjects();renderProjects();e.target.reset();$("formMessage").textContent="Project published on this browser!";
 $("explore").scrollIntoView({behavior:"smooth"});
});
$("search").addEventListener("input",renderProjects);$("filterCategory").addEventListener("change",renderProjects);$("sort").addEventListener("change",renderProjects);
$("projectList").addEventListener("click",e=>{
 const likeButton=e.target.closest("[data-like]"),commentButton=e.target.closest("[data-comments]");
 if(likeButton){
  const p=projects.find(x=>x.id===likeButton.dataset.like);if(!p)return;
  // Demo anti-spam: one vote per project per browser, remembered in localStorage.
  const voteKey=`buildboard-voted-${p.id}`;
  if(localStorage.getItem(voteKey)){likeButton.textContent=`♥ ${p.likes} Voted`;return;}
  p.likes++;localStorage.setItem(voteKey,"1");saveProjects();renderProjects();
 }
 if(commentButton){activeCommentProjectId=commentButton.dataset.comments;openComments();}
});
function openComments(){
 const p=projects.find(x=>x.id===activeCommentProjectId);if(!p)return;
 $("commentTitle").textContent=`Feedback: ${p.title}`;
 $("commentList").innerHTML=p.comments.length?p.comments.map(c=>`<div class="comment"><strong>${escapeHTML(c.author)}</strong><p>${escapeHTML(c.text)}</p></div>`).join(""):'<p class="no-comments">No comments yet. Be the first to share constructive feedback.</p>';
 $("commentDialog").showModal();
}
$("commentForm").addEventListener("submit",e=>{
 e.preventDefault();const p=projects.find(x=>x.id===activeCommentProjectId);if(!p)return;
 const author=$("commentAuthor").value.trim(),text=$("commentText").value.trim();if(!author||!text)return;
 p.comments.push({author,text});saveProjects();$("commentText").value="";openComments();renderProjects();
});
renderProjects();

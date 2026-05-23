import { useState, useMemo, useEffect, useCallback } from "react";
import { LOGO1, SCHEMAS } from "./assets.js";

// ─── TABLE DES SCHÉMAS ───────────────────────────────────────────────────────
// Code 4 chiffres : P1=type mouflage(1=Sim,2=Com) P2=traction(1=T,2=C,3=FT) P3=brins P4=PF

const SCHEMA_TABLE = [
  { code:"1110", desc:"Treuil — Mouflage Simple — 1 brin — 0 Point fixe",    tt:1, nb:1, pf:0, compose:false },
  { code:"1121", desc:"Treuil — Mouflage Simple — 2 brins — 1 Point fixe",   tt:1, nb:2, pf:1, compose:false },
  { code:"1131", desc:"Treuil — Mouflage Simple — 3 brins — 1 Point fixe",   tt:1, nb:3, pf:1, compose:false },
  { code:"1141", desc:"Treuil — Mouflage Simple — 4 brins — 1 Point fixe",   tt:1, nb:4, pf:1, compose:false },
  { code:"1142", desc:"Treuil — Mouflage Simple — 4 brins — 2 Points fixes",  tt:1, nb:4, pf:2, compose:false },
  { code:"1152", desc:"Treuil — Mouflage Simple — 5 brins — 2 Points fixes",  tt:1, nb:5, pf:2, compose:false },
  { code:"1151", desc:"Treuil — Mouflage Simple — 5 brins — 1 Point fixe",   tt:1, nb:5, pf:1, compose:false },
  { code:"2162", desc:"Treuil — Mouflage Composé — 6 brins — 2 Points fixes", tt:1, nb:6, pf:2, compose:true  },
  { code:"2161", desc:"Treuil — Mouflage Composé — 6 brins — 1 Point fixe",  tt:1, nb:6, pf:1, compose:true  },
  { code:"2183", desc:"Treuil — Mouflage Composé — 8 brins — 3 Points fixes", tt:1, nb:8, pf:3, compose:true  },
  { code:"2182", desc:"Treuil — Mouflage Composé — 8 brins — 2 Points fixes", tt:1, nb:8, pf:2, compose:true  },
  { code:"2141", desc:"Treuil — Mouflage Composé — 4 brins — 1 Point fixe",  tt:1, nb:4, pf:1, compose:true  },
  { code:"2142", desc:"Treuil — Mouflage Composé — 4 brins — 2 Points fixes", tt:1, nb:4, pf:2, compose:true  },
  { code:"1210", desc:"Crochet — Mouflage Simple — 1 brin — 0 Point fixe",    tt:2, nb:1, pf:0, compose:false },
  { code:"1221", desc:"Crochet — Mouflage Simple — 2 brins — 1 Point fixe",   tt:2, nb:2, pf:1, compose:false },
  { code:"1231", desc:"Crochet — Mouflage Simple — 3 brins — 1 Point fixe",   tt:2, nb:3, pf:1, compose:false },
  { code:"1241", desc:"Crochet — Mouflage Simple — 4 brins — 1 Point fixe",   tt:2, nb:4, pf:1, compose:false },
  { code:"1242", desc:"Crochet — Mouflage Simple — 4 brins — 2 Points fixes",  tt:2, nb:4, pf:2, compose:false },
  { code:"1252", desc:"Crochet — Mouflage Simple — 5 brins — 2 Points fixes",  tt:2, nb:5, pf:2, compose:false },
  { code:"1251", desc:"Crochet — Mouflage Simple — 5 brins — 1 Point fixe",   tt:2, nb:5, pf:1, compose:false },
  { code:"2262", desc:"Crochet — Mouflage Composé — 6 brins — 2 Points fixes", tt:2, nb:6, pf:2, compose:true  },
  { code:"2261", desc:"Crochet — Mouflage Composé — 6 brins — 1 Point fixe",  tt:2, nb:6, pf:1, compose:true  },
  { code:"2283", desc:"Crochet — Mouflage Composé — 8 brins — 3 Points fixes", tt:2, nb:8, pf:3, compose:true  },
  { code:"2282", desc:"Crochet — Mouflage Composé — 8 brins — 2 Points fixes", tt:2, nb:8, pf:2, compose:true  },
  { code:"2241", desc:"Crochet — Mouflage Composé — 4 brins — 1 Point fixe",  tt:2, nb:4, pf:1, compose:true  },
  { code:"2242", desc:"Crochet — Mouflage Composé — 4 brins — 2 Points fixes", tt:2, nb:4, pf:2, compose:true  },
  { code:"1311", desc:"Fardeau+Treuil — Mouflage Simple — 1 brin — 1 Point fixe",    tt:3, nb:1, pf:1, compose:false },
  { code:"1321", desc:"Fardeau+Treuil — Mouflage Simple — 2 brins — 1 Point fixe",   tt:3, nb:2, pf:1, compose:false },
  { code:"1331", desc:"Fardeau+Treuil — Mouflage Simple — 3 brins — 1 Point fixe",   tt:3, nb:3, pf:1, compose:false },
  { code:"1332", desc:"Fardeau+Treuil — Mouflage Simple — 3 brins — 2 Points fixes",  tt:3, nb:3, pf:2, compose:false },
  { code:"1341", desc:"Fardeau+Treuil — Mouflage Simple — 4 brins — 1 Point fixe",   tt:3, nb:4, pf:1, compose:false },
  { code:"1342", desc:"Fardeau+Treuil — Mouflage Simple — 4 brins — 2 Points fixes",  tt:3, nb:4, pf:2, compose:false },
  { code:"1351", desc:"Fardeau+Treuil — Mouflage Simple — 5 brins — 1 Point fixe",   tt:3, nb:5, pf:1, compose:false },
  { code:"1352", desc:"Fardeau+Treuil — Mouflage Simple — 5 brins — 2 Points fixes",  tt:3, nb:5, pf:2, compose:false },
  { code:"1353", desc:"Fardeau+Treuil — Mouflage Simple — 5 brins — 3 Points fixes",  tt:3, nb:5, pf:3, compose:false },
];

function getSchemaEntry(tt, nb, pf, compose) {
  return SCHEMA_TABLE.find(s =>
    s.tt === tt && s.nb === nb && s.pf === pf && s.compose === compose
  ) || null;
}

// ─── DONNÉES ────────────────────────────────────────────────────────────────

const SOLS = [
  { id:1, label:"Macadam",                  fg:0.70, fr:0.03 },
  { id:2, label:"Route sèche / Chemin dur", fg:0.50, fr:0.06 },
  { id:3, label:"Terrain humide / Gravier", fg:0.40, fr:0.15 },
  { id:4, label:"Terrain meuble",           fg:0.35, fr:0.30 },
  { id:5, label:"Boue profonde",            fg:0.30, fr:0.50 },
];
const CAS_PARTICULIERS = [
  { id:0, label:"Calcul standard"          },
  { id:1, label:"Descente d'un fardeau"    },
  { id:2, label:"Retournement sol plat"    },
  { id:3, label:"Montée pente > 100%"      },
  { id:4, label:"Enlisé jusqu'aux essieux" },
];
const CAS_LEGENDES = [
  { id:0, desc:"ΣR = (Rr ou Rg) ± Rp" },
  { id:1, desc:"ΣR = 3/2 × P"         },
  { id:2, desc:"ΣR = 2/3 × P"         },
  { id:3, desc:"ΣR = P"                },
  { id:4, desc:"ΣR = 2 × P"           },
];
const PENTE_SIN = [
  { deg:5,  sin:0.09, pct:"≤17%"   },
  { deg:10, sin:0.17, pct:"≤18%"   },
  { deg:15, sin:0.26, pct:"≤27%"   },
  { deg:20, sin:0.34, pct:"≤36%"   },
  { deg:25, sin:0.42, pct:"≤47%"   },
  { deg:30, sin:0.50, pct:"51–69%" },
  { deg:35, sin:0.57, pct:"70–83%" },
  { deg:40, sin:0.64, pct:"84–99%" },
];
const ESSENCES = [
  { id:1, label:"Chêne",                coeff:500 },
  { id:2, label:"Hêtre",                coeff:400 },
  { id:3, label:"Châtaignier",          coeff:300 },
  { id:4, label:"Sapin/Bouleau/Platane",coeff:200 },
];
const HOLMES = [
  { config:"1 chevalet",         mini:2000,  maxi:4000  },
  { config:"2 chevalets",        mini:4000,  maxi:8000  },
  { config:"3 chevalets",        mini:8000,  maxi:15000 },
  { config:"2 lots Holmès en V", mini:15000, maxi:30000 },
  { config:"Roue + 5 piquets",   mini:null,  maxi:5000  },
  { config:"Roue + 8 piquets",   mini:null,  maxi:8000  },
  { config:"4 piquets en ligne", mini:null,  maxi:4000  },
];
const SIGLES = [
  { s:"P",   u:"daN",  d:"Poids du fardeau" },
  { s:"fr",  u:"—",    d:"Coefficient de résistance au roulement" },
  { s:"fg",  u:"—",    d:"Coefficient de résistance au glissement / adhérence" },
  { s:"Rr",  u:"daN",  d:"Résistance au roulement = P × fr" },
  { s:"Rg",  u:"daN",  d:"Résistance au glissement = P × fg" },
  { s:"Rp",  u:"daN",  d:"Résistance à la pente = P × sin α" },
  { s:"ΣR",  u:"daN",  d:"Somme des résistances du fardeau" },
  { s:"EMD", u:"daN",  d:"Effort Moteur Disponible" },
  { s:"FT",  u:"daN",  d:"Force au treuil — prendre toujours la valeur mini" },
  { s:"FJ",  u:"daN",  d:"Force à la jante = 270 × (Pm×0.736) / v" },
  { s:"Pm",  u:"cv",   d:"Puissance moteur (1 cv = 0.736 kW)" },
  { s:"v",   u:"km/h", d:"Vitesse d'avancement" },
  { s:"A",   u:"daN",  d:"Adhérence = P_tracteur × fg" },
  { s:"EMT", u:"daN",  d:"Effort Moteur Total (somme des brins)" },
  { s:"S%",  u:"%",    d:"Coefficient de sécurité = (EMT−ΣR)/ΣR×100" },
  { s:"RPF", u:"daN",  d:"Résistance du Point Fixe" },
  { s:"DPF", u:"m",    d:"Distance au point fixe" },
  { s:"LC",  u:"m",    d:"Longueur du câble" },
  { s:"LS",  u:"m",    d:"Longueur de sécurité (treuil)" },
  { s:"LG",  u:"m",    d:"Longueur de garde (crochet)" },
  { s:"CMU", u:"daN",  d:"Charge Maximale d'Utilisation" },
  { s:"G",   u:"—",    d:"Garant : brin tiré directement par l'engin" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const nf=(v,dec=1)=>{
  if(v===null||v===undefined||isNaN(v)||!isFinite(v))return"—";
  return Number(v).toLocaleString("fr-FR",{minimumFractionDigits:dec,maximumFractionDigits:dec});
};
const ni=(v)=>{
  if(v===null||v===undefined||isNaN(v))return"—";
  return Number(v).toLocaleString("fr-FR",{maximumFractionDigits:0});
};

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────

function useW(){
  const [w,setW]=useState(()=>typeof window!=="undefined"?window.innerWidth:1024);
  useEffect(()=>{
    const h=()=>setW(window.innerWidth);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);
  return w;
}

// ─── CALCULS ─────────────────────────────────────────────────────────────────

function calcS1({P,mouvement,sol,pente,sensPente,casParticulier}){
  const sd=SOLS.find(s=>s.id===sol)||SOLS[2];
  const fg=sd.fg,fr=sd.fr,Rr=P*fr,Rg=P*fg,Rbase=mouvement===1?Rr:Rg;
  let Rp=0,sinA=null;
  if(pente<=50){Rp=P*(pente/100);sinA=pente/100;}
  else{
    let sv=0;
    if(pente>=51&&pente<=69)sv=0.50;
    else if(pente>=70&&pente<=83)sv=0.57;
    else if(pente>=84&&pente<=99)sv=0.64;
    sinA=sv;Rp=P*sv;
  }
  Rp*=(sensPente===0?0:sensPente);
  let SR;
  switch(casParticulier){
    case 1:SR=1.5*P;break; case 2:SR=(2/3)*P;break;
    case 3:SR=P;break;     case 4:SR=2*P;break;
    default:SR=Rbase+Rp;
  }
  return{fg,fr,Rr,Rg,Rbase,Rp,SR,sinA};
}

function calcS2({typeTraction,P_t,solT,ponts,beches,FT,Pm,v,tracteurEnPente,penteTracteur}){
  const sd=SOLS.find(s=>s.id===solT)||SOLS[2];
  const fa=sd.fg,fr_t=sd.fr,As=P_t*fa,Ab=beches?As+FT:As;
  let FJ=null,mFJA=null;
  if(Pm&&v){FJ=270*(Pm*0.736)/v;mFJA=Math.min(FJ,ponts===1?Ab:As);}
  // ΣR Tracteur : Rr seul si plat, Rr+Rp si montée
  const Rr_t=P_t*fr_t;
  const Rp_t=tracteurEnPente&&penteTracteur>0?P_t*(Number(penteTracteur)/100):0;
  const SR_t=Rr_t+Rp_t;
  let EMD;
  switch(typeTraction){
    case 1:EMD=beches?Math.min(FT,Ab):Math.min(FT,As);break;
    case 2:EMD=mFJA!==null?mFJA-SR_t:null;break;
    case 3:EMD=beches?Math.min(FT,Ab):Math.min(FT,As);break;
    default:EMD=FT;
  }
  return{fa,fr_t,As,Ab,FJ,mFJA,Rr_t,Rp_t,SR_t,EMD};
}

function calcS3(SR,EMD,compose){
  const Nb=SR/(EMD||1),NbR=Math.ceil(Nb),NbF=NbR<4?NbR+1:NbR+2;
  const isCompose=compose!==undefined?compose:NbF>5;
  return{Nb,NbR,NbF,compose:isCompose};
}
function calcS5(EMD,nb,pente){
  const brins=[];
  for(let i=0;i<Math.min(nb,8);i++){
    const e=(EMD||1)*Math.pow(0.9,i);
    brins.push({num:i+1,e,pct:Math.pow(0.9,i)});
  }
  const tot=brins.reduce((a,b)=>a+b.e,0);
  return{brins,tot,fin:pente?tot*0.9:tot};
}
function calcS6(fin,SR){
  const sp=((fin-SR)/SR)*100;
  let v,c;
  if(sp<15){v="⚠ INSUFFISANT — S% < 15%";c="red";}
  else if(sp<=70){v="✓ CONFORME — La manœuvre peut être effectuée";c="green";}
  else{v="⚠ EXCESSIF — S% > 70%";c="orange";}
  return{sp,v,c};
}
function calcRPFdispo(pf){
  if(!pf)return null;
  const{cat,Ppf,solPF,bechesPF,FTpf,typeH,nbChev,avecR,nbPiq,ess,diam}=pf;
  const sd=SOLS.find(s=>s.id===solPF)||SOLS[2];
  if(cat===1){if(Ppf==="")return null;const A=Number(Ppf)*sd.fg;return bechesPF?A+Number(FTpf||0):A;}
  if(cat===2){if(typeH===1)return(HOLMES[nbChev-1]||HOLMES[0]).maxi;if(typeH===2)return avecR?(nbPiq===8?8000:5000):4000;return 4000;}
  if(cat===3){if(diam==="")return null;const e=ESSENCES.find(x=>x.id===ess)||ESSENCES[0];return e.coeff*Math.pow(Number(diam)/10,2);}
  return null;
}
function labelMateriel(pf){
  if(!pf)return"—";
  const{cat,typeH,nbChev,avecR,nbPiq,ess,diam}=pf;
  if(cat===1)return"Véhicule tracteur";
  if(cat===2){if(typeH===1)return`Holmès — ${(HOLMES[nbChev-1]||HOLMES[0]).config}`;if(typeH===2)return avecR?`Roue + ${nbPiq} piquets`:"4 piquets en ligne";return"4 piquets en ligne";}
  if(cat===3){const e=ESSENCES.find(x=>x.id===ess)||ESSENCES[0];return`Arbre ${e.label} Ø${diam}cm`;}
  return"—";
}
const CAT_LABEL={1:"Véhicule",2:"Artificiel (Holmès/Piquets)",3:"Naturel (Arbre)"};
const newPF=()=>({cat:2,Ppf:"",solPF:3,bechesPF:0,FTpf:"",typeH:1,nbChev:1,avecR:0,nbPiq:5,ess:1,diam:"",brinsAssignes:[],forceAssignee:0,valide:false});

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────

const C={
  bg:"#060d18",card:"rgba(13,27,42,0.85)",border:"#1d3557",
  blue:"#4fc3f7",text:"#c8d6e5",muted:"#4a6fa5",dim:"#7fb3d3",
  yellow:"#f0e68c",green:"#4caf50",orange:"#ff9800",red:"#f44336",prev:"#e67e22",
};

// ─── COMPOSANTS ──────────────────────────────────────────────────────────────

const BtnReset=({label="🔄 Réinitialiser",onClick,small=false})=>(
  <button onClick={onClick} style={{
    display:"flex",alignItems:"center",gap:5,
    padding:small?"4px 10px":"7px 16px",
    borderRadius:5,border:`1px solid ${C.orange}55`,
    background:"rgba(230,126,34,0.12)",color:C.orange,
    fontSize:small?10:12,cursor:"pointer",fontFamily:"inherit",
    fontWeight:600,WebkitTapHighlightColor:"transparent",
  }}>{label}</button>
);

const CollapseBtn=({open,onToggle,label})=>(
  <button onClick={onToggle} style={{
    display:"flex",alignItems:"center",gap:5,cursor:"pointer",
    background:"rgba(79,195,247,0.07)",border:`1px solid ${C.border}`,
    color:C.dim,fontSize:11,padding:"4px 10px",borderRadius:4,
    fontFamily:"inherit",marginBottom:6,WebkitTapHighlightColor:"transparent",
  }}>
    <span style={{fontSize:13}}>{open?"▾":"▸"}</span>
    {open?`Masquer ${label}`:`Afficher ${label}`}
  </button>
);

const Inp=({label,value,onChange,unit="",min,step=1,disabled=false,ph=""})=>(
  <div style={{marginBottom:8}}>
    <label style={{display:"block",fontSize:12,color:C.text,marginBottom:3}}>{label}</label>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <input type="number" value={value} min={min} step={step} disabled={disabled}
        placeholder={ph}
        onChange={e=>onChange(e.target.value===""?"":Number(e.target.value))}
        style={{
          flex:1,maxWidth:160,padding:"6px 10px",borderRadius:4,
          border:`1px solid ${C.border}`,
          background:disabled?"#1a2535":"rgba(13,27,42,0.7)",
          color:disabled?C.muted:C.yellow,fontSize:13,
          WebkitAppearance:"none",
        }}
      />
      {unit&&<span style={{fontSize:12,color:C.dim,whiteSpace:"nowrap"}}>{unit}</span>}
    </div>
  </div>
);

const Sel=({label,value,onChange,options,note=""})=>(
  <div style={{marginBottom:8}}>
    <label style={{display:"block",fontSize:12,color:C.text,marginBottom:3}}>{label}</label>
    <select value={value} onChange={e=>onChange(Number(e.target.value))}
      style={{
        width:"100%",padding:"6px 10px",borderRadius:4,
        border:`1px solid ${C.border}`,
        background:"rgba(13,27,42,0.7)",
        color:C.yellow,fontSize:13,maxWidth:"100%",
      }}>
      {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    {note&&<div style={{fontSize:10,color:C.dim,marginTop:3,fontStyle:"italic"}}>{note}</div>}
  </div>
);

// RRow — résultats en gras + taille police légèrement plus grande
const RRow=({label,value,unit="",highlight=false,prev=false,warn=false})=>{
  const col=highlight?C.green:prev?C.prev:warn?C.orange:"#e0e0e0";
  return(
    <div style={{
      display:"flex",justifyContent:"space-between",alignItems:"baseline",
      padding:"5px 10px",marginBottom:2,borderRadius:4,
      background:highlight?"rgba(76,175,80,0.12)":prev?"rgba(230,126,34,0.09)":"transparent",
      borderLeft:`3px solid ${highlight?C.green:prev?C.prev:warn?C.orange:"transparent"}`,
      gap:8,
    }}>
      <span style={{fontSize:12,color:C.text,flex:1}}>{label}</span>
      <span style={{fontSize:14,fontWeight:700,color:col,whiteSpace:"nowrap"}}>
        {value}{unit&&<span style={{fontSize:10,color:C.dim,fontWeight:400}}> {unit}</span>}
      </span>
    </div>
  );
};

const Title=({children,roman})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,
    padding:"8px 14px",margin:"0 0 14px",
    background:"linear-gradient(90deg,#1a3a5c,#0d2540)",
    borderLeft:`4px solid ${C.blue}`,borderRadius:"0 6px 6px 0"}}>
    {roman&&<span style={{fontSize:16,fontWeight:700,color:C.blue,minWidth:24}}>{roman}</span>}
    <span style={{fontSize:14,fontWeight:600,color:"#e0f0ff",letterSpacing:0.5}}>{children}</span>
  </div>
);

const Card=({children,style={}})=>(
  <div style={{background:C.card,border:`1px solid ${C.border}`,
    borderRadius:8,padding:"14px 16px",marginBottom:12,...style}}>
    {children}
  </div>
);

const Badge=({label,value,color=C.blue})=>(
  <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",
    padding:"10px 18px",margin:4,
    background:"rgba(26,58,92,0.6)",border:`1px solid ${color}33`,
    borderRadius:8,minWidth:100}}>
    <span style={{fontSize:20,fontWeight:700,color}}>{value}</span>
    <span style={{fontSize:11,color:C.dim,marginTop:2}}>{label}</span>
  </div>
);

const Progress=({cur,tot})=>(
  <div style={{display:"flex",gap:3,alignItems:"center",margin:"8px 0 4px"}}>
    {Array.from({length:tot}).map((_,i)=>(
      <div key={i} style={{flex:1,height:3,borderRadius:2,
        background:i<=cur?C.blue:"#1d3557",transition:"background 0.3s"}}/>
    ))}
    <span style={{fontSize:11,color:C.muted,marginLeft:6,whiteSpace:"nowrap"}}>{cur+1}/{tot}</span>
  </div>
);

const NavBtns=({step,tot,go})=>(
  <div style={{display:"flex",gap:8,marginTop:16}}>
    <button onClick={()=>go(step-1)} disabled={step===0} style={{
      flex:1,padding:"11px 8px",borderRadius:6,border:`1px solid ${C.border}`,
      background:step===0?"#0a1520":"#1a3a5c",color:step===0?C.muted:"#e0f0ff",
      fontSize:13,cursor:step===0?"default":"pointer",fontFamily:"inherit",
      WebkitTapHighlightColor:"transparent",
    }}>◀ Précédent</button>
    <button onClick={()=>go(step+1)} disabled={step===tot-1} style={{
      flex:1,padding:"11px 8px",borderRadius:6,border:`1px solid ${C.blue}44`,
      background:step===tot-1?"#0a1520":"rgba(79,195,247,0.15)",
      color:step===tot-1?C.muted:C.blue,
      fontSize:13,cursor:step===tot-1?"default":"pointer",fontFamily:"inherit",fontWeight:600,
      WebkitTapHighlightColor:"transparent",
    }}>Suivant ▶</button>
  </div>
);

// ─── Affichage schéma ────────────────────────────────────────────────────────

function SchemaDisplay({entry,size="normal"}){
  const maxH = size==="small" ? 180 : size==="medium" ? 260 : 360;
  if(!entry) return(
    <div style={{padding:30,border:`2px dashed ${C.border}`,borderRadius:8,color:C.muted,fontSize:13,textAlign:"center"}}>
      Aucun schéma disponible pour cette configuration
    </div>
  );
  const img=SCHEMAS[entry.code];
  return(
    <div>
      <div style={{
        padding:"8px 12px",marginBottom:8,borderRadius:6,
        background:"rgba(13,27,42,0.8)",border:`1px solid ${C.border}`,
      }}>
        <div style={{fontSize:13,color:C.blue,fontWeight:700,marginBottom:2}}>
          {entry.desc}
        </div>
        <div style={{fontSize:11,color:C.muted}}>Code : {entry.code}</div>
      </div>
      {img
        ?<img src={img} alt={entry.code} style={{
            width:"100%",maxHeight:maxH,objectFit:"contain",
            border:`1px solid ${C.border}`,borderRadius:8,background:"#fff",
          }}/>
        :<div style={{padding:20,border:`2px dashed ${C.border}`,borderRadius:8,
            color:C.muted,fontSize:12,textAlign:"center"}}>
          Image non disponible — Code : {entry.code}
        </div>}
    </div>
  );
}

// ─── PANNEAU SIGLES ───────────────────────────────────────────────────────────

function PanneauSigles({onClose,isMobile}){
  return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,
      width:isMobile?"100%":380,
      background:"#06101e",borderLeft:`2px solid ${C.border}`,
      overflowY:"auto",zIndex:1000,padding:20,boxShadow:"-8px 0 32px #000a"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontWeight:700,color:C.blue,fontSize:15}}>📋 Sigles & Unités</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>✕</button>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{background:"#0d2540"}}>
          <th style={{padding:"6px 8px",color:C.blue,textAlign:"left"}}>Sigle</th>
          <th style={{padding:"6px 8px",color:C.dim,textAlign:"left"}}>Unité</th>
          <th style={{padding:"6px 8px",color:C.text,textAlign:"left"}}>Définition</th>
        </tr></thead>
        <tbody>{SIGLES.map((s,i)=>(
          <tr key={s.s} style={{background:i%2===0?"transparent":"rgba(13,37,64,0.4)"}}>
            <td style={{padding:"5px 8px",color:C.yellow,fontWeight:700}}>{s.s}</td>
            <td style={{padding:"5px 8px",color:C.dim}}>{s.u}</td>
            <td style={{padding:"5px 8px",color:C.text}}>{s.d}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ─── FORMULAIRE MATÉRIEL PF ───────────────────────────────────────────────────

function FormMaterielPF({pf,onChange}){
  const{cat,Ppf,solPF,bechesPF,FTpf,typeH,nbChev,avecR,nbPiq,ess,diam}=pf;
  const sd=SOLS.find(s=>s.id===solPF)||SOLS[2];
  const upd=(k,v)=>onChange({...pf,[k]:v});
  const RPF_dispo=calcRPFdispo(pf);
  return(
    <div>
      <Sel label="Catégorie" value={cat} onChange={v=>upd("cat",v)}
        options={[{v:1,l:"Véhicule (tracteur)"},{v:2,l:"Artificiel (Holmès/Piquets)"},{v:3,l:"Naturel (Arbre)"}]}/>
      {cat===1&&(<>
        <Inp label="Poids véhicule PF" value={Ppf} onChange={v=>upd("Ppf",v)} unit="daN" min={0} ph="ex: 19 000"/>
        <Sel label="Sol véhicule PF" value={solPF} onChange={v=>upd("solPF",v)} options={SOLS.map(s=>({v:s.id,l:s.label}))}/>
        <Sel label="Bêches d'ancrage" value={bechesPF} onChange={v=>upd("bechesPF",v)} options={[{v:0,l:"Non"},{v:1,l:"Oui"}]}/>
        {bechesPF===1&&<Inp label="Force treuil PF" value={FTpf} onChange={v=>upd("FTpf",v)} unit="daN" min={0} ph="ex: 5 000"/>}
        {Ppf!==""&&<RRow label="A = P × fa" value={nf(Number(Ppf)*sd.fg,0)} unit="daN"/>}
      </>)}
      {cat===2&&(<>
        <Sel label="Type" value={typeH} onChange={v=>upd("typeH",v)}
          options={[{v:1,l:"Holmès chevalets"},{v:2,l:"Piquets ± roue"},{v:3,l:"Piquets en ligne"}]}/>
        {typeH===1&&<Sel label="Nb chevalets" value={nbChev} onChange={v=>upd("nbChev",v)}
          options={[{v:1,l:"1 chevalet"},{v:2,l:"2 chevalets"},{v:3,l:"3 chevalets"},{v:4,l:"2 lots en V"}]}/>}
        {typeH===2&&(<>
          <Sel label="Avec roue de secours" value={avecR} onChange={v=>upd("avecR",v)} options={[{v:0,l:"Non"},{v:1,l:"Oui"}]}/>
          {avecR===1&&<Sel label="Nb piquets" value={nbPiq} onChange={v=>upd("nbPiq",v)} options={[{v:5,l:"5 piquets"},{v:8,l:"8 piquets"}]}/>}
        </>)}
        <div style={{marginTop:4,fontSize:11,color:C.dim,background:"#0a1520",padding:"6px 8px",borderRadius:4}}>
          <strong style={{color:C.text,display:"block",marginBottom:2}}>Table Holmès :</strong>
          {HOLMES.map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"1px 0"}}>
              <span>{r.config}</span>
              <span style={{color:C.yellow}}>{r.mini?`${ni(r.mini)}–`:"≤ "}{ni(r.maxi)} daN</span>
            </div>
          ))}
        </div>
      </>)}
      {cat===3&&(<>
        <Sel label="Essence" value={ess} onChange={v=>upd("ess",v)} options={ESSENCES.map(e=>({v:e.id,l:`${e.label} (coeff ${e.coeff})`}))}/>
        <Inp label="Diamètre" value={diam} onChange={v=>upd("diam",v)} unit="cm" min={10} step={5} ph="ex: 60"/>
        {diam!==""&&<RRow label="R = coeff × (Ø/10)²" value={nf((ESSENCES.find(x=>x.id===ess)||ESSENCES[0]).coeff*Math.pow(Number(diam)/10,2),0)} unit="daN"/>}
      </>)}
      {RPF_dispo!==null&&<RRow label="RPF disponible" value={nf(RPF_dispo,0)} unit="daN" highlight/>}
    </div>
  );
}

// ─── FONCTION MAIL ────────────────────────────────────────────────────────────

function envoyerMail({s1,s2,s3,s5,s6,nbEff,schEntry,DPF,Dfard,RPF_req,nbPF_VII,pfsValidesPourRecap,vcol}){
  const date=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const schImg=schEntry?SCHEMAS[schEntry.code]:null;
  const schDesc=schEntry?schEntry.desc:"—";
  const schCode=schEntry?schEntry.code:"—";
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>
body{font-family:Arial,sans-serif;background:#f0f4f8;padding:20px;color:#1a1a2e}
.c{max-width:700px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
.h{background:linear-gradient(135deg,#0d2540,#1a3a5c);color:#fff;padding:24px 28px}
.h h1{margin:0;font-size:22px}.h p{margin:6px 0 0;opacity:0.7;font-size:13px}
.v{padding:16px 28px;font-size:16px;font-weight:700;border-left:6px solid ${vcol};background:${s6.c==="green"?"#e8f5e9":s6.c==="orange"?"#fff3e0":"#ffebee"};color:${vcol}}
.s{padding:16px 28px;border-bottom:1px solid #e0e8f0}
.s h3{margin:0 0 12px;font-size:13px;color:#4a6fa5;text-transform:uppercase;letter-spacing:1px}
table{width:100%;border-collapse:collapse;font-size:13px}
td{padding:7px 10px;border-bottom:1px solid #eef2f7}td:first-child{color:#666;width:55%}td:last-child{font-weight:700;text-align:right}
.si{padding:16px 28px;text-align:center}.f{background:#f8fafc;padding:12px 28px;text-align:center;font-size:11px;color:#999}
</style></head><body><div class="c">
<div class="h"><h1>⚙ SENSESRD — Récapitulatif Manœuvre de Force</h1>
<p>Bureau Maintenance Logistique — 1er RTP — LTN LAOUAR</p><p style="font-size:11px;opacity:0.6">Généré le ${date}</p></div>
<div class="v">VERDICT : ${s6.v}</div>
<div class="s"><h3>I — Résistances</h3><table>
<tr><td>ΣR Fardeau</td><td>${nf(s1.SR,0)} daN</td></tr>
<tr><td>Résistance base</td><td>${nf(s1.Rbase,0)} daN</td></tr>
<tr><td>Résistance pente Rp</td><td>${nf(Math.abs(s1.Rp),0)} daN</td></tr>
</table></div>
<div class="s"><h3>II — Effort Moteur Disponible</h3><table>
<tr><td>EMD</td><td>${nf(s2.EMD,0)} daN</td></tr>
<tr><td>Adhérence A</td><td>${nf(s2.As,0)} daN</td></tr>
${s2.FJ!==null?`<tr><td>Force jante FJ</td><td>${nf(s2.FJ,0)} daN</td></tr>`:""}
<tr><td>ΣR Tracteur</td><td>${nf(s2.SR_t,0)} daN</td></tr>
</table></div>
<div class="s"><h3>III — Nombre de Brins</h3><table>
<tr><td>Nb brins effectif</td><td>${nbEff} brins</td></tr>
<tr><td>Type de mouflage</td><td>${s3.compose?"MOUFLAGE COMPOSÉ":"Mouflage simple"}</td></tr>
</table></div>
<div class="s"><h3>IV — Schéma</h3><table>
<tr><td>Code</td><td>${schCode}</td></tr>
<tr><td>Description</td><td>${schDesc}</td></tr>
</table></div>
<div class="s"><h3>V — Effort Moteur Total</h3><table>
<tr><td>EMT Total</td><td>${nf(s5.tot,1)} daN</td></tr>
<tr><td>EMT Final</td><td>${nf(s5.fin,2)} daN</td></tr>
</table></div>
<div class="s"><h3>VI — Sécurité</h3><table>
<tr><td>S%</td><td style="color:${vcol};font-weight:700">${nf(s6.sp,2)} %</td></tr>
<tr><td>Verdict</td><td style="color:${vcol}">${s6.v}</td></tr>
</table></div>
<div class="s"><h3>VII — Points Fixes</h3><table>
<tr><td>RPF Requise</td><td>${nf(RPF_req,1)} daN</td></tr>
${pfsValidesPourRecap.map(pf=>`<tr><td>PF n°${pf.num} — ${pf.materiel}</td><td>${pf.RPFdispo!==null?nf(pf.RPFdispo,0)+" daN":"-"} ${pf.valide?"✓":""}</td></tr>`).join("")}
</table></div>
<div class="s"><h3>VIII — Distances</h3><table>
<tr><td>DPF</td><td>${DPF!==null?nf(DPF,2):"—"} m</td></tr>
<tr><td>Déplacement fardeau</td><td>${Dfard!==null?nf(Dfard,2):"—"} m</td></tr>
</table></div>
${schImg?`<div class="si"><h3 style="font-size:13px;color:#4a6fa5;margin-bottom:10px">${schDesc}</h3><img src="${schImg}" style="max-width:100%;border:1px solid #ddd;border-radius:8px"/></div>`:""}
<div class="f">SENSESRD — 1er RTP — Bureau Maintenance Logistique</div>
</div></body></html>`;
  const blob=new Blob([html],{type:"text/html"});
  const url=URL.createObjectURL(blob);
  window.open(url,"_blank");
  const textMail=`SENSESRD — Récapitulatif\nDate : ${date}\nVERDICT : ${s6.v}\nΣR=${nf(s1.SR,0)} daN | EMD=${nf(s2.EMD,0)} daN | Nb brins=${nbEff} | Schéma=${schCode} | EMT=${nf(s5.fin,2)} daN | S%=${nf(s6.sp,2)}%`;
  window.location.href=`mailto:?subject=${encodeURIComponent("SENSESRD — Manœuvre de Force — "+date)}&body=${encodeURIComponent(textMail)}`;
}

// ─── APPLICATION PRINCIPALE ──────────────────────────────────────────────────

export default function SenseSRD(){
  const w=useW();
  const isMobile=w<700;
  const grid2=isMobile?"1fr":"1fr 1fr";

  // Étape I
  const[P,setP]=useState("");
  const[mouv,setMouv]=useState(1);
  const[sol,setSol]=useState(3);
  const[pente,setPente]=useState("");
  const[sensPente,setSensPente]=useState(1);
  const[casP,setCasP]=useState(0);
  // Étape II
  const[typeTr,setTypeTr]=useState(3);
  const[Pt,setPt]=useState("");
  const[solT,setSolT]=useState(3);
  const[ponts,setPonts]=useState(1);
  const[beches,setBeches]=useState(1);
  const[FT,setFT]=useState("");
  const[Pm,setPm]=useState("");
  const[vitesse,setVitesse]=useState("");
  const[tracteurEnPente,setTracteurEnPente]=useState(0);
  const[penteTracteur,setPenteTracteur]=useState("");
  // Étape IV/V
  const[nbPF_schema,setNbPF_schema]=useState(1);
  const[nbManuel,setNbManuel]=useState(0);
  const[penteEMT,setPenteEMT]=useState(1);
  const[modeCompose,setModeCompose]=useState(false);
  // Étape VII
  const[brinsInc,setBrinsInc]=useState([1,1,1,1,1,1,1,1]);
  const[nbPF_VII,setNbPF_VII]=useState(1);
  const[pfsData,setPfsData]=useState([newPF(),newPF(),newPF()]);
  const[activePF,setActivePF]=useState(0);
  const[pfValides,setPfValides]=useState([false,false,false]);
  // Étape VIII
  const[LC,setLC]=useState("");
  const[LS,setLS]=useState("");
  const[LG,setLG]=useState("");
  // UI
  const[step,setStep]=useState(0);
  const[sigles,setSigles]=useState(false);
  const[showTrigo,setShowTrigo]=useState(false);
  const[showLegSol,setShowLegSol]=useState(false);
  const[showLegCas,setShowLegCas]=useState(false);
  const[showCoeff,setShowCoeff]=useState(false);
  const[showR3,setShowR3]=useState(false);
  const[showR4,setShowR4]=useState(false);

  // Valeurs numériques
  const Pv=Number(P)||0,pentev=Number(pente)||0;
  const Ptv=Number(Pt)||0,FTv=Number(FT)||0;
  const Pmv=Number(Pm)||0,vv=Number(vitesse)||0;

  // Calculs
  const s1=useMemo(()=>calcS1({P:Pv,mouvement:mouv,sol,pente:pentev,sensPente,casParticulier:casP}),[Pv,mouv,sol,pentev,sensPente,casP]);
  const s2=useMemo(()=>calcS2({typeTraction:typeTr,P_t:Ptv,solT,ponts,beches,FT:FTv,Pm:Pmv,v:vv,tracteurEnPente,penteTracteur}),[typeTr,Ptv,solT,ponts,beches,FTv,Pmv,vv,tracteurEnPente,penteTracteur]);
  const s3=useMemo(()=>calcS3(s1.SR,s2.EMD||1,modeCompose),[s1.SR,s2.EMD,modeCompose]);
  const nbEff=nbManuel>0?nbManuel:s3.NbF;
  const s5=useMemo(()=>calcS5(s2.EMD||1,nbEff,penteEMT),[s2.EMD,nbEff,penteEMT]);
  const s6=useMemo(()=>calcS6(s5.fin,s1.SR),[s5.fin,s1.SR]);
  const RPF_req=useMemo(()=>s5.brins.reduce((a,b,i)=>a+(brinsInc[i]?b.e:0),0),[s5.brins,brinsInc]);
  
  // Schéma
  const schEntry=useMemo(()=>getSchemaEntry(typeTr,nbEff,nbPF_schema,s3.compose),[typeTr,nbEff,nbPF_schema,s3.compose]);
  
  const isTreuil=typeTr!==2;
  const LCn=Number(LC)||0,LSn=Number(LS)||0,LGn=Number(LG)||0;
  let DPF=null,Dfard=null;
  if(isTreuil&&LCn>0){DPF=(LCn-LSn)/nbEff;Dfard=DPF;}
  else if(!isTreuil&&LCn>0&&nbEff>1){DPF=(LCn-LGn)/(nbEff-1);Dfard=(DPF-LGn+LCn)/nbEff;}
  
  const pfsValidesPourRecap=nbPF_VII===0?[]:Array.from({length:nbPF_VII}).map((_,i)=>{
    const pf=pfsData[i];
    return{num:i+1,forceRequise:pf.forceAssignee,brinsAssignes:pf.brinsAssignes,cat:pf.cat,materiel:labelMateriel(pf),RPFdispo:calcRPFdispo(pf),valide:pfValides[i]};
  });
  const vcol=s6.c==="green"?C.green:s6.c==="orange"?C.orange:C.red;
  const vbg=s6.c==="green"?"#0f2a0f":s6.c==="orange"?"#2a1e06":"#2a0f0f";

  const STEPS=["I — ΣR Fardeau","II — Effort Moteur","III — Nb Brins","IV — Schéma","V — EMT","VI — Sécurité","VII — Points Fixes","VIII — Distances","✓ Récapitulatif"];
  const TOT=STEPS.length;
  const go=(i)=>setStep(Math.max(0,Math.min(TOT-1,i)));

  // Resets
  const resetAll=useCallback(()=>{
    setP("");setMouv(1);setSol(3);setPente("");setSensPente(1);setCasP(0);
    setTypeTr(3);setPt("");setSolT(3);setPonts(1);setBeches(1);setFT("");setPm("");setVitesse("");
    setTracteurEnPente(0);setPenteTracteur("");
    setNbPF_schema(1);setNbManuel(0);setPenteEMT(1);setModeCompose(false);
    setBrinsInc([1,1,1,1,1,1,1,1]);setNbPF_VII(1);
    setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);
    setLC("");setLS("");setLG("");setStep(0);
  },[]);

  const resetSteps=[
    useCallback(()=>{setP("");setMouv(1);setSol(3);setPente("");setSensPente(1);setCasP(0);setTypeTr(3);setPt("");setSolT(3);setPonts(1);setBeches(1);setFT("");setPm("");setVitesse("");setTracteurEnPente(0);setPenteTracteur("");setNbManuel(0);setPenteEMT(1);setModeCompose(false);setBrinsInc([1,1,1,1,1,1,1,1]);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);setLC("");setLS("");setLG("");},[]),
    useCallback(()=>{setTypeTr(3);setPt("");setSolT(3);setPonts(1);setBeches(1);setFT("");setPm("");setVitesse("");setTracteurEnPente(0);setPenteTracteur("");setNbManuel(0);setPenteEMT(1);setModeCompose(false);setBrinsInc([1,1,1,1,1,1,1,1]);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);setLC("");setLS("");setLG("");},[]),
    useCallback(()=>{setNbManuel(0);setModeCompose(false);setBrinsInc([1,1,1,1,1,1,1,1]);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);},[]),
    useCallback(()=>{setNbPF_schema(1);setNbManuel(0);setModeCompose(false);},[]),
    useCallback(()=>{setPenteEMT(1);setNbManuel(0);setBrinsInc([1,1,1,1,1,1,1,1]);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);},[]),
    useCallback(()=>{setNbManuel(0);setBrinsInc([1,1,1,1,1,1,1,1]);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);},[]),
    useCallback(()=>{setBrinsInc([1,1,1,1,1,1,1,1]);setNbPF_VII(1);setPfsData([newPF(),newPF(),newPF()]);setActivePF(0);setPfValides([false,false,false]);},[]),
    useCallback(()=>{setLC("");setLS("");setLG("");},[]),
    resetAll,
  ];

  const handleAjouterBrinsAuPF=()=>{
    if(nbPF_VII===0)return;
    const sel=s5.brins.filter((_,i)=>brinsInc[i]).map(b=>({num:b.num,effort:b.e}));
    const force=sel.reduce((a,b)=>a+b.effort,0);
    setPfsData(pfsData.map((pf,i)=>i===activePF?{...pf,brinsAssignes:sel,forceAssignee:force,valide:false}:pf));
  };
  const handleValiderMateriel=()=>{
    const pf=pfsData[activePF];
    if(calcRPFdispo(pf)===null)return;
    const newV=[...pfValides];newV[activePF]=true;setPfValides(newV);
    const next=Array.from({length:nbPF_VII}).findIndex((_,i)=>i>activePF&&!newV[i]);
    if(next!==-1)setActivePF(next);
  };
  const updatePF=(idx,data)=>{
    setPfsData(pfsData.map((p,i)=>i===idx?data:p));
    const newV=[...pfValides];newV[idx]=false;setPfValides(newV);
  };

  const BarreReset=()=>(
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
      <BtnReset label="🔄 Réinitialiser l'étape" onClick={resetSteps[step]} small/>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#060d18,#0a1628,#06101e)",
      fontFamily:"'Courier New','Lucida Console',monospace",color:"#e0e0e0"}}>

      {/* HEADER */}
      <div style={{background:"linear-gradient(90deg,#050d1a,#0d2540,#050d1a)",borderBottom:`2px solid ${C.border}`,padding:isMobile?"8px 12px":"12px 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {LOGO1&&<img src={LOGO1} alt="logo" style={{height:isMobile?40:56,objectFit:"contain"}}/>}
            <div>
              <div style={{fontSize:isMobile?9:11,color:C.blue,letterSpacing:2,textTransform:"uppercase"}}>Bureau Maintenance Logistique</div>
              <div style={{fontSize:isMobile?16:20,fontWeight:700,color:"#e0f0ff",letterSpacing:1}}>⚙ SENSESRD</div>
              <div style={{fontSize:isMobile?10:12,color:C.dim}}>Calculatrice de Manœuvre de Force</div>
            </div>
          </div>
          <div style={{textAlign:"right",display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            <div style={{fontSize:11,color:C.muted}}>LTN LAOUAR — 1e RTP</div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setSigles(x=>!x)} style={{padding:"5px 10px",borderRadius:4,border:`1px solid ${C.border}`,background:"rgba(79,195,247,0.1)",color:C.blue,fontSize:10,cursor:"pointer",fontFamily:"inherit",WebkitTapHighlightColor:"transparent"}}>📋 Sigles</button>
              <button onClick={resetAll} style={{padding:"5px 10px",borderRadius:4,border:`1px solid ${C.orange}55`,background:"rgba(230,126,34,0.1)",color:C.orange,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,WebkitTapHighlightColor:"transparent"}}>🔄 Tout réinit.</button>
            </div>
          </div>
        </div>
      </div>

      {/* ONGLETS */}
      <div style={{background:"#050d1a",borderBottom:`1px solid ${C.border}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{display:"flex",padding:"0 8px",minWidth:"max-content"}}>
          {STEPS.map((s,i)=>(
            <button key={i} onClick={()=>go(i)} style={{
              padding:isMobile?"8px 9px":"10px 13px",border:"none",cursor:"pointer",
              fontSize:isMobile?10:11,fontFamily:"inherit",letterSpacing:0.2,whiteSpace:"nowrap",
              borderBottom:step===i?`3px solid ${C.blue}`:"3px solid transparent",
              background:"transparent",color:step===i?C.blue:C.muted,
              transition:"color 0.2s",WebkitTapHighlightColor:"transparent"}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 12px 0"}}>
        <Progress cur={step} tot={TOT}/>
      </div>

      {/* CONTENU */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"10px 10px 48px":"12px 16px 48px"}}>
        <BarreReset/>

        {/* ════ ÉTAPE I ════ */}
        {step===0&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <Card>
              <Title roman="I">Somme des Résistances du Fardeau</Title>
              <div style={{fontSize:12,color:C.dim,marginBottom:10}}>Formule : ΣR = (Rr ou Rg) ± Rp</div>
              <Inp label="Poids du fardeau P" value={P} onChange={setP} unit="daN" min={0} step={100} ph="ex : 9 600"/>
              <Sel label="Type de mouvement" value={mouv} onChange={setMouv} options={[{v:1,l:"Roule"},{v:2,l:"Glisse"}]}/>
              <Sel label="Nature du sol" value={sol} onChange={setSol} options={SOLS.map(s=>({v:s.id,l:`${s.id}. ${s.label}`}))}/>
              <CollapseBtn open={showLegSol} onToggle={()=>setShowLegSol(x=>!x)} label="la légende des sols"/>
              {showLegSol&&(
                <div style={{background:"#0a1520",borderRadius:5,padding:"8px 10px",marginBottom:6,fontSize:11,color:C.dim}}>
                  {SOLS.map(s=>(
                    <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid #0d2540"}}>
                      <span style={{color:C.text}}>{s.id}. {s.label}</span>
                      <span style={{color:C.yellow,whiteSpace:"nowrap",marginLeft:8}}>fg={s.fg} · fr={s.fr}</span>
                    </div>
                  ))}
                </div>
              )}
              <Inp label="Pente (%)" value={pente} onChange={setPente} unit="%" min={0} max={100} ph="ex : 25"/>
              <Sel label="Sens de la pente" value={sensPente} onChange={setSensPente} options={[{v:1,l:"Montée (+)"},{v:0,l:"Plat (0)"},{v:-1,l:"Descente (−)"}]}/>
              <Sel label="Cas particulier" value={casP} onChange={setCasP} options={CAS_PARTICULIERS.map(c=>({v:c.id,l:`${c.id} — ${c.label}`}))}/>
              <CollapseBtn open={showLegCas} onToggle={()=>setShowLegCas(x=>!x)} label="la légende des cas particuliers"/>
              {showLegCas&&(
                <div style={{background:"#0a1520",borderRadius:5,padding:"8px 10px",marginBottom:6,fontSize:11,color:C.dim}}>
                  {CAS_PARTICULIERS.map((c,i)=>(
                    <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid #0d2540"}}>
                      <span style={{color:C.text}}>{c.id} — {c.label}</span>
                      <span style={{color:C.yellow,marginLeft:8}}>{CAS_LEGENDES[i].desc}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginTop:6}}>
                <CollapseBtn open={showTrigo} onToggle={()=>setShowTrigo(x=>!x)} label="la table trigonométrique"/>
                {showTrigo&&(
                  <div style={{background:"#0a1520",borderRadius:6,padding:"10px 12px"}}>
                    <div style={{fontSize:11,color:C.blue,fontWeight:700,marginBottom:6}}>TABLE TRIGO — sin α par tranche de pente</div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr style={{background:"#0d2540"}}>
                        <th style={{padding:"4px 8px",color:C.dim,textAlign:"left"}}>Angle</th>
                        <th style={{padding:"4px 8px",color:C.dim,textAlign:"center"}}>sin α</th>
                        <th style={{padding:"4px 8px",color:C.dim,textAlign:"center"}}>Pente</th>
                      </tr></thead>
                      <tbody>{PENTE_SIN.map((r,i)=>(
                        <tr key={i} style={{background:i%2===0?"transparent":"rgba(13,37,64,0.4)"}}>
                          <td style={{padding:"3px 8px",color:C.text}}>{r.deg}°</td>
                          <td style={{padding:"3px 8px",color:C.yellow,textAlign:"center",fontWeight:700}}>{r.sin}</td>
                          <td style={{padding:"3px 8px",color:C.dim,textAlign:"center"}}>{r.pct}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <div style={{fontSize:12,color:C.dim,marginBottom:10}}>Résultats automatiques</div>
              <RRow label="fg / fa"                    value={nf(s1.fg,2)}/>
              <RRow label="fr (roulement)"             value={nf(s1.fr,2)}/>
              <RRow label="Rr = P × fr"                value={nf(s1.Rr,0)}    unit="daN"/>
              <RRow label="Rg = P × fg"                value={nf(s1.Rg,0)}    unit="daN"/>
              <RRow label="Résistance de base"         value={nf(s1.Rbase,0)} unit="daN"/>
              <RRow label="Rp — Résistance à la pente" value={nf(Math.abs(s1.Rp),0)} unit="daN"/>
              {pentev>50&&<div style={{fontSize:11,color:C.orange,margin:"4px 10px"}}>⚠ Pente &gt;50% — sin α = {nf(s1.sinA,2)}</div>}
              <RRow label="ΣR FARDEAU" value={nf(s1.SR,0)} unit="daN" highlight/>
              <div style={{marginTop:10}}>
                <CollapseBtn open={showCoeff} onToggle={()=>setShowCoeff(x=>!x)} label="les coefficients"/>
                {showCoeff&&(
                  <div style={{fontSize:11,color:C.muted,background:"#0a1520",padding:"8px 10px",borderRadius:5}}>
                    {SOLS.map(s=><div key={s.id} style={{padding:"2px 0",borderBottom:"1px solid #0d2540"}}>
                      <span style={{color:C.text}}>{s.id}. {s.label}</span>{" — "}
                      <span style={{color:C.yellow}}>fg={s.fg}, fr={s.fr}</span>
                    </div>)}
                  </div>
                )}
              </div>
            </Card>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE II ════ */}
        {step===1&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <Card>
              <Title roman="II">Effort Moteur Disponible (EMD)</Title>
              <RRow label="▶ ΣR Fardeau (Étape I)" value={nf(s1.SR,0)} unit="daN" prev/>
              <Sel label="Type de traction" value={typeTr} onChange={setTypeTr}
                options={[{v:1,l:"1 — Treuil"},{v:2,l:"2 — Crochet"},{v:3,l:"3 — Fardeau avec treuil"}]}/>
              <Inp label="Poids tracteur" value={Pt} onChange={setPt} unit="daN" min={0} step={500} ph="ex : 19 000"/>
              <Sel label="Sol tracteur" value={solT} onChange={setSolT} options={SOLS.map(s=>({v:s.id,l:`${s.id}. ${s.label}`}))}/>
              <Sel label="Ponts moteurs" value={ponts} onChange={setPonts} options={[{v:1,l:"Tous ponts moteur"},{v:2,l:"1 seul pont"}]}/>
              <Sel label="Bêches d'ancrage" value={beches} onChange={setBeches} options={[{v:1,l:"Disponibles"},{v:0,l:"Non disponibles"}]}/>

              {/* TREUIL */}
              {(typeTr===1||typeTr===3)&&(
                <div style={{marginTop:8,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
                  <div style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:6}}>━ TREUIL ━</div>
                  <Inp label="Force au treuil FT" value={FT} onChange={setFT} unit="daN" min={0} step={100} ph="ex : 5 000"/>
                  <div style={{fontSize:11,color:C.orange,padding:"4px 8px",background:"rgba(255,152,0,0.08)",borderRadius:4,marginTop:-4,marginBottom:4}}>
                    ⚠ Prendre toujours la valeur <strong>mini</strong> indiquée par le constructeur
                  </div>
                </div>
              )}

              {/* CROCHET */}
              {typeTr===2&&(
                <div style={{marginTop:8,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
                  <div style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:6}}>━ CROCHET ━</div>
                  <Inp label="Puissance (Cv)" value={Pm} onChange={setPm} unit="cv" min={0} ph="ex : 155"/>
                  <div style={{fontSize:10,color:C.dim,marginTop:-4,marginBottom:6,fontStyle:"italic"}}>Rappel : 1 cv = 0,736 kW</div>
                  <Inp label="Vitesse v" value={vitesse} onChange={setVitesse} unit="km/h" min={0} ph="ex : 4"/>
                  {/* Pente tracteur */}
                  <Sel label="Situation du tracteur" value={tracteurEnPente} onChange={setTracteurEnPente}
                    options={[{v:0,l:"Sur du plat"},{v:1,l:"En pente (montée)"}]}/>
                  {tracteurEnPente===1&&(
                    <Inp label="Pente tracteur (%)" value={penteTracteur} onChange={setPenteTracteur} unit="%" min={0} max={100} ph="ex : 10"/>
                  )}
                </div>
              )}
            </Card>
            <Card>
              <div style={{fontSize:12,color:C.dim,marginBottom:8}}>Résultats automatiques</div>
              <RRow label="fa (adhérence tracteur)" value={nf(s2.fa,2)}/>
              <RRow label="fr tracteur"             value={nf(s2.fr_t,2)}/>
              <RRow label="A = P_tracteur × fa"     value={nf(s2.As,0)} unit="daN"/>
              {beches===1&&<RRow label="A bêches = A + FT" value={nf(s2.Ab,0)} unit="daN"/>}
              {typeTr===2&&s2.FJ!==null&&(<>
                <RRow label="FJ = 270×(Pm×0,736)/v"    value={nf(s2.FJ,0)}   unit="daN"/>
                <RRow label="min(FJ, A)"                value={nf(s2.mFJA,0)} unit="daN"/>
                <RRow label="Rr tracteur"               value={nf(s2.Rr_t,0)} unit="daN"/>
                {tracteurEnPente===1&&<RRow label="Rp tracteur (pente)" value={nf(s2.Rp_t,0)} unit="daN"/>}
                <RRow label="ΣR Tracteur = Rr + Rp"    value={nf(s2.SR_t,0)} unit="daN"/>
              </>)}
              <RRow label="EMD — RÉSULTAT FINAL" value={nf(s2.EMD,0)} unit="daN" highlight/>
            </Card>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE III ════ */}
        {step===2&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <Card>
              <Title roman="III">Nombre de Brins</Title>
              <div style={{fontSize:12,color:C.dim,marginBottom:10}}>Nb = ΣR / EMD → arrondi sup → +1 si &lt;4 ; +2 si ≥4</div>
              <RRow label="▶ ΣR Fardeau (I)" value={nf(s1.SR,0)}   unit="daN" prev/>
              <RRow label="▶ EMD (II)"        value={nf(s2.EMD,0)} unit="daN" prev/>
              <Sel label="Type de mouflage" value={modeCompose?1:0} onChange={v=>setModeCompose(!!v)}
                options={[{v:0,l:"Auto (calculé)"},{v:1,l:"Forcer Composé"}]}/>
              <RRow label="Nb brut = ΣR / EMD"           value={nf(s3.Nb,4)}/>
              <RRow label="Nb arrondi (entier supérieur)" value={s3.NbR}/>
              <RRow label="Nb final (règle +1/+2)"        value={s3.NbF} highlight/>
              <RRow label="Type de mouflage" value={s3.compose?"MOUFLAGE COMPOSÉ":"Mouflage simple"} warn={s3.compose}/>
              <div style={{marginTop:8}}>
                <CollapseBtn open={showR3} onToggle={()=>setShowR3(x=>!x)} label="les règles"/>
                {showR3&&(
                  <div style={{fontSize:12,color:C.dim,lineHeight:2,background:"#0a1520",padding:"10px 12px",borderRadius:6}}>
                    <div>📌 Règle 1 : Arrondir Nb brut à l'entier SUPÉRIEUR</div>
                    <div>📌 Règle 2a : Si entier &lt; 4 → ajouter <strong style={{color:C.blue}}>1 brin</strong></div>
                    <div>📌 Règle 2b : Si entier ≥ 4 → ajouter <strong style={{color:C.blue}}>2 brins</strong></div>
                    <div>📌 Si Nb final &gt; 5 → MOUFLAGE COMPOSÉ requis</div>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Badge label="Nb brut"    value={nf(s3.Nb,2)} color={C.dim}/>
                <Badge label="Nb arrondi" value={s3.NbR}       color={C.blue}/>
                <Badge label="Nb final"   value={s3.NbF}       color={C.green}/>
              </div>
              <div style={{marginTop:20,padding:14,background:"#0a1520",borderRadius:8,textAlign:"center"}}>
                <div style={{fontSize:12,color:C.dim,marginBottom:6}}>Type de mouflage</div>
                <div style={{fontSize:18,fontWeight:700,color:s3.compose?C.orange:C.green}}>
                  {s3.compose?"⚠ MOUFLAGE COMPOSÉ":"✓ Mouflage simple"}
                </div>
              </div>
            </Card>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE IV ════ */}
        {step===3&&(
          <Card>
            <Title roman="IV">Schéma du Mouflage</Title>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",background:"rgba(230,126,34,0.07)",borderRadius:6,padding:"8px 12px",marginBottom:14,border:`1px solid ${C.prev}22`}}>
              <RRow label="▶ ΣR (I)" value={nf(s1.SR,0)} unit="daN" prev/>
              <RRow label="▶ EMD (II)" value={nf(s2.EMD,0)} unit="daN" prev/>
              <RRow label="▶ Nb brins (III)" value={s3.NbF} prev/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:grid2,gap:12,marginBottom:12}}>
              <div>
                <Sel label="Type de traction" value={typeTr} onChange={setTypeTr}
                  options={[{v:1,l:"Treuil"},{v:2,l:"Crochet"},{v:3,l:"Fardeau avec treuil"}]}/>
                <Sel label="Nombre de points fixes" value={nbPF_schema} onChange={setNbPF_schema}
                  options={[{v:0,l:"0 Point fixe"},{v:1,l:"1 Point fixe"},{v:2,l:"2 Points fixes"},{v:3,l:"3 Points fixes"}]}/>
                <div style={{padding:"8px 12px",background:"#0a1520",borderRadius:6,fontSize:12,marginTop:4}}>
                  <div><span style={{color:C.dim}}>Nb effectif : </span><strong style={{color:C.green}}>{nbEff}</strong></div>
                  <div style={{marginTop:4,fontWeight:700,fontSize:13,color:s3.compose?C.orange:C.green}}>
                    {s3.compose?"⚠ MOUFLAGE COMPOSÉ":"✓ Mouflage simple"}
                  </div>
                </div>
                <div style={{marginTop:8}}>
                  <CollapseBtn open={showR4} onToggle={()=>setShowR4(x=>!x)} label="les règles de tracé"/>
                  {showR4&&(
                    <div style={{fontSize:11,color:C.muted,lineHeight:1.9,background:"#0a1520",padding:"10px 12px",borderRadius:6,marginBottom:8}}>
                      <div>1. Mouflage avec le + de brins côté FARDEAU</div>
                      <div>2. Si Nb &gt; 5 → MOUFLAGE COMPOSÉ</div>
                      <div>3. Simple = 1 poulie mobile + dormant côté fardeau</div>
                      <div>4. Composé = garant du 2ᵉ mouflage attaqué par le 1ᵉʳ</div>
                    </div>
                  )}
                </div>
              </div>
              <SchemaDisplay entry={schEntry} size="normal"/>
            </div>
            <NavBtns step={step} tot={TOT} go={go}/>
          </Card>
        )}

        {/* ════ ÉTAPE V ════ */}
        {step===4&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <Card>
              <Title roman="V">Effort Moteur Total (EMT)</Title>
              <div style={{fontSize:12,color:C.dim,marginBottom:8}}>EMD sur le 1ᵉʳ brin, −10% par poulie</div>
              <RRow label="▶ ΣR (I)"   value={nf(s1.SR,0)}  unit="daN" prev/>
              <RRow label="▶ EMD (II)" value={nf(s2.EMD,0)} unit="daN" prev/>
              <RRow label="▶ Nb (III)" value={s3.NbF}                  prev/>
              <RRow label="Nb effectif utilisé" value={nbEff} highlight/>
              <Sel label="Pente présente ?" value={penteEMT} onChange={setPenteEMT}
                options={[{v:1,l:"Oui"},{v:0,l:"Non"}]}
                note={penteEMT===1?"→ Correction −10% appliquée sur l'EMT total":"→ Aucune correction appliquée"}/>
            </Card>
            <Card>
              <div style={{fontSize:12,color:C.text,fontWeight:600,marginBottom:10}}>Détail par brin</div>
              <div style={{display:"grid",gridTemplateColumns:"58px 1fr 68px 52px",gap:4,fontSize:11,color:C.muted,marginBottom:6}}>
                <span>Brin</span><span>Effort (daN)</span><span>Perte</span><span>% EMD</span>
              </div>
              {s5.brins.map((b,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr 68px 52px",gap:4,fontSize:12,padding:"3px 0",borderBottom:`1px solid #0d2540`,color:i===0?C.blue:C.text}}>
                  <span>Brin {b.num}{i===0?" (G)":""}</span>
                  <span style={{fontWeight:700}}>{nf(b.e,1)}</span>
                  <span>{i===0?"—":"-10%"}</span>
                  <span>{nf(b.pct*100,1)}%</span>
                </div>
              ))}
              <div style={{marginTop:12}}>
                <RRow label="EMT TOTAL"               value={nf(s5.tot,1)} unit="daN"/>
                <RRow label="EMT FINAL (corr. pente)" value={nf(s5.fin,2)} unit="daN" highlight/>
              </div>
            </Card>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE VI ════ */}
        {step===5&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <Card>
              <Title roman="VI">Sécurité</Title>
              <div style={{fontSize:12,color:C.dim,marginBottom:8}}>S% = (EMT − ΣR) / ΣR × 100 → 15% ≤ S% ≤ 70%</div>
              <RRow label="▶ ΣR (I)"   value={nf(s1.SR,0)}  unit="daN" prev/>
              <RRow label="▶ EMT (V)"  value={nf(s5.fin,2)} unit="daN" prev/>
              {(()=>{
                const nonConf=s6.c!=="green";
                const nbCible=s6.c==="red"?nbEff+1:s6.c==="orange"?nbEff-1:null;
                const action=s6.c==="red"?"Ajouter 1 brin":s6.c==="orange"?"Enlever 1 brin":null;
                return(
                  <div style={{marginTop:10,padding:14,background:nonConf?"rgba(244,67,54,0.08)":"rgba(79,195,247,0.07)",borderRadius:6,border:`1px solid ${nonConf?C.red+"66":C.border}`}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:10,color:nonConf?C.red:C.blue}}>⟳ Ajustement du nombre de brins</div>
                    <Inp label="Nombre de brins total (0 = auto)" value={nbManuel} onChange={setNbManuel} min={0} max={8} ph="0"/>
                    {nonConf&&action&&nbCible!==null&&(
                      <div style={{marginTop:6,padding:"8px 10px",background:s6.c==="red"?"rgba(244,67,54,0.12)":"rgba(255,152,0,0.12)",borderRadius:5}}>
                        <div style={{fontSize:13,color:s6.c==="red"?C.red:C.orange,fontWeight:700}}>⚠ {action}</div>
                        <div style={{fontSize:12,color:C.dim,marginTop:3}}>→ Corriger à l'<strong style={{color:C.blue}}>Étape III</strong> ou dans le champ ci-dessus</div>
                        <div style={{fontSize:13,marginTop:4}}>Nombre cible : <strong style={{fontSize:16,color:C.green}}>{nbCible}</strong></div>
                      </div>
                    )}
                    {!nonConf&&<div style={{fontSize:12,color:C.green,marginTop:4,fontWeight:600}}>✓ Nb de brins conforme</div>}
                    {nbManuel>0&&(
                      <button onClick={()=>go(3)} style={{marginTop:10,padding:"7px 16px",borderRadius:4,border:`1px solid ${C.orange}55`,background:"rgba(230,126,34,0.15)",color:C.orange,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,WebkitTapHighlightColor:"transparent"}}>
                        ↩ Retour Étape IV — Mettre à jour le schéma
                      </button>
                    )}
                  </div>
                );
              })()}
              <div style={{marginTop:10}}>
                <RRow label="Nb brins utilisés"      value={nbEff}/>
                <RRow label="S% = (EMT−ΣR)/ΣR×100" value={nf(s6.sp,2)} unit="%" highlight/>
              </div>
              <div style={{marginTop:14,padding:"12px 16px",borderRadius:8,background:vbg,border:`1px solid ${vcol}`,color:vcol,fontWeight:600,fontSize:15}}>{s6.v}</div>
            </Card>
            <Card>
              <div style={{fontSize:12,color:C.text,fontWeight:600,marginBottom:12}}>Rappel des seuils</div>
              {[
                {s:"S% < 15%",       l:"INSUFFISANT",c:C.red,   a:"→ Ajouter 1 brin"},
                {s:"15% ≤ S% ≤ 70%", l:"CONFORME ✓", c:C.green, a:"→ Manœuvre possible"},
                {s:"S% > 70%",       l:"EXCESSIF",   c:C.orange,a:"→ Enlever 1 brin"},
              ].map(({s,l,c,a})=>(
                <div key={s} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 12px",marginBottom:6,borderRadius:6,background:"rgba(13,27,42,0.5)",border:`1px solid ${c}33`}}>
                  <span style={{color:c,fontWeight:700,minWidth:130,fontSize:12}}>{s}</span>
                  <div><div style={{color:c,fontWeight:600,fontSize:13}}>{l}</div><div style={{color:C.dim,fontSize:11}}>{a}</div></div>
                </div>
              ))}
              <div style={{marginTop:20,textAlign:"center"}}>
                <div style={{fontSize:48,fontWeight:700,color:vcol}}>{nf(s6.sp,1)}%</div>
                <div style={{fontSize:12,color:C.dim}}>Coefficient de sécurité</div>
              </div>
            </Card>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE VII ════ */}
        {step===6&&(
          <div style={{display:"grid",gridTemplateColumns:grid2,gap:12}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Card style={{marginBottom:0}}>
                <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:10}}>A. Sélection des brins pour calcul RPF</div>
                <RRow label="▶ EMT final (V)" value={nf(s5.fin,2)} unit="daN" prev/>
                <div style={{display:"grid",gridTemplateColumns:"54px 1fr 36px 72px",gap:4,fontSize:11,color:C.muted,marginBottom:6}}>
                  <span>Brin</span><span>Effort daN</span><span>✓</span><span>Inclus</span>
                </div>
                {s5.brins.map((b,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"54px 1fr 36px 72px",gap:4,fontSize:12,padding:"4px 0",borderBottom:`1px solid #0d2540`,alignItems:"center"}}>
                    <span style={{color:C.dim}}>Brin {b.num}</span>
                    <span style={{color:C.text,fontWeight:700}}>{nf(b.e,1)}</span>
                    <input type="checkbox" checked={!!brinsInc[i]} onChange={e=>{const n=[...brinsInc];n[i]=e.target.checked?1:0;setBrinsInc(n);}} style={{accentColor:C.blue,width:18,height:18}}/>
                    <span style={{color:brinsInc[i]?C.blue:C.muted}}>{brinsInc[i]?nf(b.e,1):"—"}</span>
                  </div>
                ))}
                <RRow label="RPF REQUISE = Σ brins inclus" value={nf(RPF_req,1)} unit="daN" highlight/>
                <button onClick={handleAjouterBrinsAuPF} disabled={nbPF_VII===0} style={{marginTop:10,width:"100%",padding:"9px 16px",borderRadius:6,border:`1px solid ${nbPF_VII===0?C.border:C.blue}`,background:nbPF_VII===0?"#0a1520":"rgba(79,195,247,0.12)",color:nbPF_VII===0?C.muted:C.blue,fontSize:12,fontWeight:700,cursor:nbPF_VII===0?"not-allowed":"pointer",fontFamily:"inherit",opacity:nbPF_VII===0?0.5:1,WebkitTapHighlightColor:"transparent"}}>
                  {nbPF_VII===0?"— Sélectionner d'abord un nb de PF (Bloc B) —":`[ Ajouter les brins au Point Fixe n°${activePF+1} ]`}
                </button>
              </Card>
              <Card style={{marginBottom:0}}>
                <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:10}}>B. Résistances de point fixe RPF</div>
                <Sel label="Nombre de points fixes" value={nbPF_VII} onChange={v=>{setNbPF_VII(v);setActivePF(0);setPfValides([false,false,false]);}}
                  options={[{v:0,l:"0 — Aucun"},{v:1,l:"1 point fixe"},{v:2,l:"2 points fixes"},{v:3,l:"3 points fixes"}]}/>
                {nbPF_VII>0&&Array.from({length:nbPF_VII}).map((_,i)=>{
                  const pf=pfsData[i],force=pf.forceAssignee||0,isActive=activePF===i,isValide=pfValides[i];
                  return(
                    <div key={i} style={{marginTop:8,padding:"10px 12px",borderRadius:6,border:`2px solid ${isValide?C.green:isActive?C.blue:C.border}`,background:isValide?"rgba(76,175,80,0.07)":isActive?"rgba(79,195,247,0.06)":"rgba(13,27,42,0.4)",cursor:"pointer",WebkitTapHighlightColor:"transparent"}} onClick={()=>setActivePF(i)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:12,fontWeight:700,color:isValide?C.green:isActive?C.blue:C.text}}>PF n°{i+1}{isValide&&" ✓"}{isActive&&!isValide&&" ← actif"}</span>
                        {!isValide&&<span style={{fontSize:10,color:C.muted}}>configurer →</span>}
                      </div>
                      {pf.brinsAssignes.length>0
                        ?<div style={{marginTop:4,fontSize:11,color:C.dim}}>{pf.brinsAssignes.map(b=>`Brin ${b.num}`).join(" + ")}{" = "}<strong style={{color:isValide?C.green:C.blue}}>{nf(force,1)} daN</strong></div>
                        :<div style={{marginTop:4,fontSize:11,color:C.muted,fontStyle:"italic"}}>Aucun brin assigné</div>}
                      {isValide&&<div style={{marginTop:4,fontSize:11,color:C.green}}>{labelMateriel(pf)} — {nf(calcRPFdispo(pf),0)} daN</div>}
                    </div>
                  );
                })}
              </Card>
              {schEntry&&(
                <Card style={{marginBottom:0}}>
                  <SchemaDisplay entry={schEntry} size="small"/>
                </Card>
              )}
            </div>
            <div>
              {nbPF_VII===0?(
                <Card><Title roman="VII">Résistance du Point Fixe</Title>
                  <div style={{padding:"20px",textAlign:"center",color:C.blue,fontWeight:700}}>Traction directe — aucun PF requis</div>
                </Card>
              ):(
                <Card>
                  <Title roman="VII">Configuration — PF n°{activePF+1}</Title>
                  {nbPF_VII>1&&(
                    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                      {Array.from({length:nbPF_VII}).map((_,i)=>(
                        <button key={i} onClick={()=>setActivePF(i)} style={{padding:"5px 14px",borderRadius:4,fontFamily:"inherit",fontSize:11,cursor:"pointer",border:`1px solid ${activePF===i?C.blue:C.border}`,background:activePF===i?"rgba(79,195,247,0.15)":"transparent",color:activePF===i?C.blue:pfValides[i]?C.green:C.muted,fontWeight:activePF===i?700:400,WebkitTapHighlightColor:"transparent"}}>
                          PF n°{i+1}{pfValides[i]?" ✓":""}
                        </button>
                      ))}
                    </div>
                  )}
                  {pfsData[activePF].brinsAssignes.length>0
                    ?<RRow label={`Force requise PF n°${activePF+1}`} value={nf(pfsData[activePF].forceAssignee,1)} unit="daN" prev/>
                    :<div style={{padding:"8px 12px",marginBottom:10,borderRadius:4,background:"rgba(244,67,54,0.07)",border:`1px solid ${C.red}33`,fontSize:11,color:C.muted}}>⚠ Aucun brin assigné — utiliser le Bloc A</div>}
                  <FormMaterielPF pf={pfsData[activePF]} onChange={(data)=>updatePF(activePF,data)}/>
                  {(()=>{const dispo=calcRPFdispo(pfsData[activePF]),req=pfsData[activePF].forceAssignee||0;if(dispo===null)return null;const ok=dispo>=req;return(<div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:ok?"#1b3a1b":"#3a1b1b",border:`1px solid ${ok?C.green:C.red}`,color:ok?C.green:C.red,fontWeight:600,fontSize:14}}>{ok?"✓ CONFORME":"✗ INSUFFISANT — Renforcer le point fixe"}</div>);})()}
                  {(()=>{const dispo=calcRPFdispo(pfsData[activePF]),req=pfsData[activePF].forceAssignee||0,ok=dispo!==null&&dispo>=req;return(<button onClick={handleValiderMateriel} disabled={!ok||pfValides[activePF]} style={{marginTop:12,width:"100%",padding:"10px 16px",borderRadius:6,border:`1px solid ${ok&&!pfValides[activePF]?C.green:C.border}`,background:ok&&!pfValides[activePF]?"rgba(76,175,80,0.15)":"#0a1520",color:ok&&!pfValides[activePF]?C.green:C.muted,fontSize:12,fontWeight:700,cursor:ok&&!pfValides[activePF]?"pointer":"not-allowed",fontFamily:"inherit",opacity:ok&&!pfValides[activePF]?1:0.5,WebkitTapHighlightColor:"transparent"}}>{pfValides[activePF]?"✓ Matériel validé":"[ Valider et intégrer le matériel conforme ]"}</button>);})()}
                  {Array.from({length:nbPF_VII}).every((_,i)=>pfValides[i])&&<div style={{marginTop:10,padding:"8px 12px",borderRadius:6,background:"rgba(76,175,80,0.1)",border:`1px solid ${C.green}`,fontSize:12,color:C.green,fontWeight:600,textAlign:"center"}}>✓ Tous les points fixes validés</div>}
                </Card>
              )}
            </div>
            <div style={{gridColumn:"1/-1"}}><NavBtns step={step} tot={TOT} go={go}/></div>
          </div>
        )}

        {/* ════ ÉTAPE VIII ════ */}
        {step===7&&(
          <>
            <Card style={{padding:"10px 16px",marginBottom:8}}>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <RRow label="▶ ΣR (I)"          value={nf(s1.SR,0)}   unit="daN" prev/>
                <RRow label="▶ Nb brins"          value={nbEff}                    prev/>
                <RRow label="▶ RPF requise (VII)" value={nf(RPF_req,1)} unit="daN" prev/>
              </div>
            </Card>
            <Card>
              <Title roman="VIII">Distances — Implantation & Déplacement</Title>
              <Inp label="Longueur câble LC" value={LC} onChange={setLC} unit="m" min={0} step={0.5} ph="ex : 50"/>
              {isTreuil
                ?<Inp label="Longueur sécurité LS" value={LS} onChange={setLS} unit="m" min={0} step={0.5} ph="ex : 3"/>
                :<Inp label="Longueur de garde LG"  value={LG} onChange={setLG} unit="m" min={0} step={0.5} ph="ex : 2"/>}
              <div style={{marginTop:10}}>
                <RRow label="DPF — Distance au point fixe" value={DPF!==null?nf(DPF,2):"—"}   unit="m" highlight/>
                <RRow label="Déplacement du fardeau"       value={Dfard!==null?nf(Dfard,2):"—"} unit="m" highlight/>
              </div>
              <div style={{marginTop:14,padding:10,background:"#0a1520",borderRadius:6,fontSize:11,color:C.dim}}>
                <strong style={{color:C.text,display:"block",marginBottom:4}}>Formules :</strong>
                Treuil — DPF = (LC − LS) / Nb | Crochet — DPF = (LC − LG) / (Nb − 1)
              </div>
            </Card>
            <NavBtns step={step} tot={TOT} go={go}/>
          </>
        )}

        {/* ════ RÉCAPITULATIF ════ */}
        {step===8&&(
          <Card>
            <Title>✓ Récapitulatif SENSESRD</Title>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <BtnReset label="🔄 Réinitialiser tout" onClick={resetAll}/>
              <button onClick={()=>window.print()} style={{padding:"7px 16px",borderRadius:5,border:`1px solid ${C.blue}55`,background:"rgba(79,195,247,0.12)",color:C.blue,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,WebkitTapHighlightColor:"transparent"}}>🖨 Imprimer</button>
              <button onClick={()=>envoyerMail({s1,s2,s3,s5,s6,nbEff,schEntry,DPF,Dfard,RPF_req,nbPF_VII,pfsValidesPourRecap,vcol})} style={{padding:"7px 16px",borderRadius:5,border:`1px solid ${C.green}55`,background:"rgba(76,175,80,0.12)",color:C.green,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,WebkitTapHighlightColor:"transparent"}}>✉ Envoyer par mail</button>
            </div>

            <div style={{marginBottom:16,padding:"14px 18px",borderRadius:8,background:vbg,border:`2px solid ${vcol}`}}>
              <div style={{fontSize:16,fontWeight:700,color:vcol}}>VERDICT : {s6.v}</div>
              <div style={{marginTop:6,fontSize:13,color:C.dim}}>Mouflage : <strong style={{color:s3.compose?C.orange:C.green}}>{s3.compose?"COMPOSÉ":"Simple"}</strong></div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10,marginBottom:20}}>
              {[
                {n:"I",   t:"RÉSISTANCES",      l:"ΣR Fardeau", v:nf(s1.SR,0),  u:"daN"},
                {n:"II",  t:"EFFORT DISPONIBLE",l:"EMD",         v:nf(s2.EMD,0), u:"daN"},
                {n:"III", t:"NOMBRE DE BRINS",  l:"Nb brins",    v:nbEff,          u:"brins"},
                {n:"IV",  t:"CODE SCHÉMA",      l:"Code",        v:schEntry?schEntry.code:"—", u:""},
                {n:"V",   t:"EFFORT TOTAL",     l:"EMT",         v:nf(s5.fin,2), u:"daN"},
                {n:"VI",  t:"SÉCURITÉ",         l:"S%",          v:nf(s6.sp,2),  u:"%"},
                {n:"VIII",t:"DISTANCE PF",      l:"DPF",         v:DPF!==null?nf(DPF,2):"—", u:"m"},
                {n:"VIII",t:"DÉPLACEMENT",      l:"Fardeau",     v:Dfard!==null?nf(Dfard,2):"—", u:"m"},
              ].map((row,idx)=>(
                <div key={idx} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:"#0a1520",border:`1px solid ${C.border}`,borderRadius:8}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"#1a3a5c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.blue,flexShrink:0}}>{row.n}</div>
                  <div>
                    <div style={{fontSize:10,color:C.muted,letterSpacing:1}}>{row.t}</div>
                    <div style={{fontSize:11,color:C.dim}}>{row.l}</div>
                    <div style={{fontSize:15,fontWeight:700,color:"#e0f0ff"}}>{row.v}<span style={{fontSize:10,color:C.dim,fontWeight:400}}> {row.u}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description schéma dans le récap */}
            {schEntry&&(
              <div style={{marginBottom:16,padding:"10px 14px",borderRadius:6,background:"rgba(13,27,42,0.8)",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:2}}>DESCRIPTION SCHÉMA</div>
                <div style={{fontSize:13,color:C.blue,fontWeight:700}}>{schEntry.desc}</div>
                <div style={{fontSize:10,color:C.muted}}>Code : {schEntry.code}</div>
              </div>
            )}

            {/* Bilan PF */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:10,padding:"6px 12px",background:"#0d2540",borderRadius:4}}>VII — BILAN MATÉRIEL POINTS FIXES</div>
              {nbPF_VII===0
                ?<div style={{padding:"12px 16px",borderRadius:6,background:"rgba(79,195,247,0.06)",border:`1px solid ${C.border}`,fontSize:12,color:C.dim,textAlign:"center"}}>Aucun matériel requis.</div>
                :<div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{background:"#0d2540"}}>
                      {["PF","Brins","Force Req.","Catégorie","Matériel","Force Dispo.","Statut"].map(h=><th key={h} style={{padding:"7px 10px",color:C.blue,textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {pfsValidesPourRecap.map((pf,i)=>{
                        const ok=pf.RPFdispo!==null&&pf.RPFdispo>=pf.forceRequise;
                        return(
                          <tr key={i} style={{background:i%2===0?"transparent":"rgba(13,37,64,0.4)",borderBottom:`1px solid ${C.border}`}}>
                            <td style={{padding:"7px 10px",color:C.text,fontWeight:700}}>n°{pf.num}</td>
                            <td style={{padding:"7px 10px",color:C.dim}}>{pf.brinsAssignes.length>0?pf.brinsAssignes.map(b=>`B${b.num}`).join("+"):"—"}</td>
                            <td style={{padding:"7px 10px",color:C.prev,fontWeight:700}}>{nf(pf.forceRequise,1)} daN</td>
                            <td style={{padding:"7px 10px",color:C.dim}}>{CAT_LABEL[pf.cat]||"—"}</td>
                            <td style={{padding:"7px 10px",color:C.text}}>{pf.materiel}</td>
                            <td style={{padding:"7px 10px",color:C.green,fontWeight:700}}>{pf.RPFdispo!==null?`${nf(pf.RPFdispo,0)} daN`:"—"}</td>
                            <td style={{padding:"7px 10px",fontWeight:700,color:pf.valide?(ok?C.green:C.red):C.muted}}>{pf.valide?(ok?"✓ OK":"✗ INSUF."):"Attente"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>}
            </div>

            {/* Schéma récap */}
            {schEntry&&(
              <div style={{marginTop:16}}>
                <SchemaDisplay entry={schEntry} size="medium"/>
              </div>
            )}

            <NavBtns step={step} tot={TOT} go={go}/>
          </Card>
        )}

      </div>

      {/* FOOTER */}
      <div style={{background:"#050d1a",borderTop:`1px solid ${C.border}`,padding:"10px 20px",textAlign:"center",fontSize:11,color:"#2a4a6a"}}>
        SENSESRD — Calculatrice de Manœuvre de Force | LTN LAOUAR — 1er RTP | Bureau Maintenance Logistique
      </div>

      {sigles&&<PanneauSigles onClose={()=>setSigles(false)} isMobile={isMobile}/>}
    </div>
  );
}

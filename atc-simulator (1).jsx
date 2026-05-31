import React, { useState } from 'react';
import {
  Plane,
  Truck,
  Clock,
  Wind,
  ChevronRight,
  Eye,
  RotateCcw,
  Radio,
  Lightbulb,
  Info,
  CheckCircle2,
  ArrowLeft,
  Shuffle,
  AlertTriangle,
  Layers,
} from 'lucide-react';

const COLORS = {
  departure: '#ef4444',
  arrival: '#3b82f6',
  circuit: '#a855f7',
  transit: '#94a3b8',
  vehicle: '#f59e0b',
};

const SCENARIO_1_STEPS = [
  {
    id: 1,
    time: '10:01:15',
    speaker: { role: 'PILOTE', callsign: 'F-PQ', color: 'departure' },
    message: 'AURIOL Tour, F-PQ, bonjour',
    expectedResponse: "F-PQ, AURIOL Tour, bonjour, j'écoute",
    teaching: "Premier contact radio. On accuse réception en répétant l'indicatif réduit, on s'identifie comme tour, et on invite le pilote à transmettre son message.",
    aircraft: [],
  },
  {
    id: 2,
    time: '10:01:35',
    speaker: { role: 'PILOTE', callsign: 'F-PQ', color: 'departure' },
    message: 'FGBPQ, PA28, poste A2, VFR destination LYON-BRON via Morgon, demande roulage',
    expectedResponse: "F-PQ, piste 27 en service, vent 260°/10 kt, QNH 1019, roulez point d'attente piste 27",
    teaching: "Premier message d'intentions. On transmet les paramètres essentiels (piste, vent, QNH) puis la clairance de roulage. Le pilote collationnera piste, QNH et clairance de roulage. Strip : trait vertical rouge (départ).",
    aircraft: [
      { id: 'F-PQ', type: 'departure', x: 360, y: 245, label: 'F-PQ', heading: 0 },
    ],
  },
  {
    id: 3,
    time: '10:04:30',
    speaker: { role: 'PILOTE', callsign: 'F-PQ', color: 'departure' },
    message: 'F-PQ, prêt',
    expectedResponse: 'F-PQ, alignez-vous, piste 27 autorisé décollage, vent 260°/10 kt',
    teaching: "F-PQ est au point d'attente H2. Aucun conflit détecté (piste libre, aucun trafic en l'air). On donne alignement + autorisation de décollage avec le vent. La piste est considérée occupée dès la clairance d'alignement.",
    aircraft: [
      { id: 'F-PQ', type: 'departure', x: 549, y: 156, label: 'F-PQ', heading: -90 },
    ],
  },
  {
    id: 4,
    time: '10:05:00',
    speaker: { role: 'INFO' },
    message: 'F-PQ a décollé. Heure de lever des roues : 10:05:00 — à noter sur le strip. Le strip de F-PQ se déplace au-dessus de la barrette piste.',
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-PQ', type: 'departure', x: 200, y: 130, label: 'F-PQ', heading: -90 },
    ],
  },
  {
    id: 5,
    time: '10:07:30',
    speaker: { role: 'PILOTE', callsign: 'F-PQ', color: 'departure' },
    message: 'AURIOL Tour, F-PQ, je quitte la fréquence',
    expectedResponse: 'F-PQ, roger, au revoir',
    teaching: "On accuse réception, on note l'heure de dernier contact sur le strip puis on archive.",
    aircraft: [
      { id: 'F-PQ', type: 'departure', x: 80, y: 70, label: 'F-PQ', heading: -90 },
    ],
  },
  {
    id: 6,
    time: '10:09:00',
    speaker: { role: 'PILOTE', callsign: 'F-AB', color: 'arrival' },
    message: 'AURIOL Tour, F-AB, bonjour',
    expectedResponse: "F-AB, AURIOL Tour, bonjour, j'écoute",
    teaching: "Nouveau premier contact. F-AB n'est pas encore en vue (estimé dans 5 minutes) mais on accuse réception et on attend ses intentions.",
    aircraft: [],
  },
  {
    id: 7,
    time: '10:09:20',
    speaker: { role: 'PILOTE', callsign: 'F-AB', color: 'arrival' },
    message: 'FGBAB, Cessna 172, provenance GRENOBLE, via Saint-Amour, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse: 'F-AB, piste 27 en service, vent 260°/10 kt, QNH 1019, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching: "Saint-Amour est au Nord-Est. Comme cette zone est déjà côté vent arrière main droite (au Nord de la piste), l'intégration est directe — pas besoin de vertical tour. Strip : trait vertical bleu (arrivée).",
    aircraft: [
      { id: 'F-AB', type: 'arrival', x: 620, y: 85, label: 'F-AB', heading: 225 },
    ],
    showSaintAmour: true,
  },
  {
    id: 8,
    time: '10:11:30',
    speaker: { role: 'PILOTE', callsign: 'F-AB', color: 'arrival' },
    message: 'F-AB, vent arrière main droite piste 27',
    expectedResponse: 'F-AB, numéro 1, rappelez finale piste 27',
    teaching: "F-AB est seul dans le circuit. On donne son numéro d'ordre (1) et on demande le report en finale.",
    aircraft: [
      { id: 'F-AB', type: 'arrival', x: 280, y: 100, label: 'F-AB', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 9,
    time: '10:13:00',
    speaker: { role: 'PILOTE', callsign: 'F-AB', color: 'arrival' },
    message: 'F-AB, finale piste 27',
    expectedResponse: 'F-AB, piste 27 autorisé atterrissage, vent 260°/10 kt',
    teaching: "Piste libre, aucun conflit. On autorise l'atterrissage en redonnant le vent.",
    aircraft: [
      { id: 'F-AB', type: 'arrival', x: 605, y: 130, label: 'F-AB', heading: -90 },
    ],
  },
  {
    id: 10,
    time: '10:14:30',
    speaker: { role: 'PILOTE', callsign: 'F-AB', color: 'arrival' },
    message: 'F-AB, piste dégagée, demande roulage',
    expectedResponse: 'F-AB, roulez poste D1',
    teaching: "F-AB a libéré la piste. On lui assigne un poste libre — un Cessna 172 ira typiquement vers le parking aéroclub D.",
    aircraft: [
      { id: 'F-AB', type: 'arrival', x: 420, y: 178, label: 'F-AB', heading: -90 },
    ],
  },
];

const SCENARIO_2_STEPS = [
  {
    id: 1,
    time: '08:38:30',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'AURIOL Tour, F-EN, demande approche directe piste 27',
    expectedResponse: 'F-EN, exécutez approche directe piste 27, rappelez longue finale',
    teaching: "F-EN demande une approche directe (pas de tour de piste). On l'autorise et on demande le rappel longue finale pour suivre sa progression. Son strip est déjà au tableau.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 660, y: 132, label: 'F-EN', heading: 270 },
    ],
  },
  {
    id: 2,
    time: '08:38:45',
    speaker: { role: 'PILOTE', callsign: 'F-GANC', color: 'departure' },
    message: 'AURIOL Tour, FGANC, DA42, poste A2, destination TOUSSUS-LE-NOBLE via Saint-Amour, demande roulage',
    expectedResponse: "F-GANC, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching: "Clairance de roulage standard. Le DA42 va rouler de A2 vers le point d'attente H2. Strip : trait rouge (départ).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 620, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 350, y: 245, label: 'F-NC', heading: 0 },
    ],
  },
  {
    id: 3,
    time: '08:39:00',
    speaker: { role: 'PILOTE', callsign: 'F-BVXN', color: 'circuit' },
    message: 'AURIOL Tour, FBVXN, DR400, poste C1, demande roulage pour un tour de piste',
    expectedResponse: "F-BVXN, piste 27 en service, vent 250°/10 kt, QNH 1020, laissez passer le DA42 du parking principal vers le point d'attente piste 27, puis roulez point d'attente piste 27",
    teaching: "F-NC (en A2) et F-XN (en C1) vont devoir converger vers le même point d'attente. Pour éviter un conflit au sol, on fait passer F-NC en premier. « Laissez passer » = give way. Strip de F-XN : trait rouge+bleu (tour de piste).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 560, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 360, y: 245, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 4,
    time: '08:42:20',
    speaker: { role: 'INFO' },
    message: "F-EN a atterri et a dépassé l'intersection H2. F-NC et F-XN ont atteint le point d'attente piste 27 (F-NC en premier, F-XN derrière).",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 320, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 549, y: 158, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 174, label: 'F-XN', heading: 270 },
    ],
  },
  {
    id: 5,
    time: '08:42:45',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'F-NC, prêt, demande remontée piste 27',
    expectedResponse: 'F-NC, remontez piste 27, alignez-vous et attendez',
    teaching: "F-NC demande backtrack (remontée) pour utiliser toute la longueur de la piste. On l'autorise à remonter au seuil 27, s'aligner et ATTENDRE. Pas encore de clairance décollage — F-EN est toujours sur la piste.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 250, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 549, y: 158, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 174, label: 'F-XN', heading: 270 },
    ],
  },
  {
    id: 6,
    time: '08:43:10',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, piste dégagée, demande roulage pour le parking',
    expectedResponse: 'F-EN, roulez poste A4',
    teaching: "F-EN a libéré la piste. On lui assigne un poste pour qu'il aille se garer.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 230, y: 178, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 158, label: 'F-XN', heading: 270 },
    ],
  },
  {
    id: 7,
    time: '08:43:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: "F-XN, prêt, demande départ de l'intersection",
    expectedResponse: 'F-XN, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27',
    teaching: "F-XN demande un décollage depuis l'intersection H2 (sans remontée). F-NC est aligné devant lui au seuil et attend. F-XN partira en premier depuis H2, puis F-NC suivra. On donne alignement + décollage + rappel vent arrière (tour de piste).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 210, y: 245, label: 'F-EN', heading: 0 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 132, label: 'F-XN', heading: 270 },
    ],
  },
];

const SCENARIO_3_STEPS = [
  {
    id: 1,
    time: '09:15:30',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'AURIOL Tour, SÉCURITÉ, demande à procéder du SSLIA au local technique',
    expectedResponse: "SÉCURITÉ, procédez point d'attente piste 27",
    teaching: "Piste 27 en service → on dit « point d'attente piste 27 ». Si la piste 09 était en service, la phraséologie serait « point d'attente intersection H2 » à la place (pour éviter toute confusion avec la piste en service). SÉCURITÉ roule vers le point d'attente mais ne traverse pas encore.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 200, y: 100, label: 'F-CD', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 2,
    time: '09:16:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'AURIOL Tour, FNMVH, Cessna 172, provenance RENNES via Julienas, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse: 'F-VH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, trafic en tour de piste DR400, rappelez vent arrière',
    teaching: "F-VH vient de Julienas (au Nord) → intégration directe en vent arrière main droite (pas de vertical tour). IMPORTANT : on l'informe du trafic en tour de piste (F-CD). Strip trait bleu.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 320, y: 100, label: 'F-CD', heading: 90 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 195, label: 'SÉCU' },
    ],
  },
  {
    id: 3,
    time: '09:17:30',
    speaker: { role: 'PILOTE', callsign: 'F-CD', color: 'circuit' },
    message: 'F-CD, vent arrière main droite piste 27',
    expectedResponse: "F-CD, numéro 1, rappelez finale piste 27, trafic à l'arrivée de Julienas vers vent arrière, Cessna 172",
    teaching: "F-CD est numéro 1 (F-VH n'est pas encore en pattern). Information de trafic réciproque : F-CD doit aussi savoir que F-VH arrive.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 420, y: 100, label: 'F-CD', heading: 90 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 158, label: 'SÉCU' },
    ],
    showPattern: true,
  },
  {
    id: 4,
    time: '09:18:00',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'SÉCURITÉ, demande traversée piste 27',
    expectedResponse: 'SÉCURITÉ, traversez piste 27',
    teaching: "F-CD est en vent arrière (pas en finale), piste actuellement libre. F-VH est encore loin (5 min). Aucun trafic n'utilise ni n'est sur le point d'utiliser la piste → traversée autorisée. La traversée non urgente cède le pas aux trafics : ici la traversée peut se faire sans gêner les avions.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 500, y: 100, label: 'F-CD', heading: 135 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 158, label: 'SÉCU' },
    ],
    showPattern: true,
  },
  {
    id: 5,
    time: '09:18:45',
    speaker: { role: 'PILOTE', callsign: 'F-CD', color: 'circuit' },
    message: 'F-CD, finale piste 27, complet',
    expectedResponse: 'F-CD, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching: "F-CD termine son tour de piste par un atterrissage complet (« complet » = atterrissage final, pas de toucher). Piste libre, SÉCURITÉ a déjà traversé. On autorise.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 605, y: 132, label: 'F-CD', heading: 270 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 95, label: 'SÉCU' },
    ],
  },
  {
    id: 6,
    time: '09:19:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 1, rappelez finale piste 27',
    teaching: "F-CD a atterri et roule au sol — il n'est plus en pattern. F-VH est désormais seul → numéro 1.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 350, y: 178, label: 'F-CD', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 280, y: 100, label: 'F-VH', heading: 90 },
    ],
    showPattern: true,
  },
];

const SCENARIO_4_STEPS = [
  {
    id: 1,
    time: '11:22:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, courte finale',
    expectedResponse: 'F-VH, remettez les gaz, rappelez vent arrière piste 27',
    teaching: "F-CD vient de faire un toucher et est encore sur la piste en train de redécoller. F-VH en courte finale n'a PAS la séparation suffisante. On commande la remise de gaz (go-around) et on demande à F-VH de rappeler vent arrière pour reprendre place dans le circuit.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 380, y: 130, label: 'F-CD', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 615, y: 132, label: 'F-VH', heading: 270 },
    ],
  },
  {
    id: 2,
    time: '11:23:30',
    speaker: { role: 'INFO' },
    message: "F-VH a remis les gaz, monte et rejoint le circuit. F-CD a poursuivi son décollage et est en vent arrière. Les deux aéronefs sont visibles dans le pattern.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 350, y: 100, label: 'F-CD', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 3,
    time: '11:24:00',
    speaker: { role: 'PILOTE', callsign: 'F-CD', color: 'circuit' },
    message: 'F-CD, vent arrière main droite piste 27',
    expectedResponse: 'F-CD, numéro 1, rappelez finale piste 27, trafic en remise de gaz, Cessna 172',
    teaching: "F-CD est devant F-VH dans le circuit (il était déjà en pattern avant la remise de gaz). F-CD prend le numéro 1, F-VH suivra. Info trafic réciproque utile pour la situation.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 420, y: 100, label: 'F-CD', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 260, y: 100, label: 'F-VH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 4,
    time: '11:24:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un DR400 en vent arrière, rappelez finale',
    teaching: "F-VH est numéro 2 derrière F-CD. On lui demande de suivre visuellement le DR400 et de rappeler en finale.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 480, y: 100, label: 'F-CD', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 300, y: 100, label: 'F-VH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 5,
    time: '11:25:30',
    speaker: { role: 'PILOTE', callsign: 'F-CD', color: 'circuit' },
    message: 'F-CD, finale piste 27',
    expectedResponse: 'F-CD, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching: "Piste libre (F-VH encore en vent arrière), on autorise l'atterrissage de F-CD.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 605, y: 132, label: 'F-CD', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 450, y: 100, label: 'F-VH', heading: 90 },
    ],
  },
  {
    id: 6,
    time: '11:27:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching: "F-CD a atterri et roule au sol. F-VH peut être autorisé à atterrir à son tour.",
    aircraft: [
      { id: 'F-CD', type: 'circuit', x: 200, y: 178, label: 'F-CD', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
    ],
  },
];

const SCENARIOS = [
  {
    id: 'scenario_1',
    title: 'Départ et arrivée VFR',
    description: "Un départ simple suivi d'une arrivée. Idéal pour démarrer.",
    difficulty: 'Débutant',
    color: '#10b981',
    icon: 'plane',
    setup: { wind: '260°/10 kt', qnh: '1019', rwy: '27' },
    steps: SCENARIO_1_STEPS,
  },
  {
    id: 'scenario_2',
    title: 'Trafic mixte au départ',
    description: 'Approche directe + deux départs simultanés. Gestion du « laissez passer » et du départ d\'intersection.',
    difficulty: 'Intermédiaire',
    color: '#f59e0b',
    icon: 'shuffle',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_2_STEPS,
  },
  {
    id: 'scenario_3',
    title: 'SÉCURITÉ et tour de piste',
    description: 'Véhicule + tour de piste + arrivée. Phraséologie SÉCURITÉ et décision de traversée.',
    difficulty: 'Intermédiaire',
    color: '#3b82f6',
    icon: 'truck',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_3_STEPS,
  },
  {
    id: 'scenario_4',
    title: 'Remise de gaz',
    description: "Aéronef en finale doit remettre les gaz à cause d'un trafic encore sur la piste. Reséquencement du circuit.",
    difficulty: 'Avancé',
    color: '#ef4444',
    icon: 'alert',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_4_STEPS,
  },
];

function AirportMap({ aircraft = [], showPattern = false, showSaintAmour = false }) {
  return (
    <svg viewBox="0 0 700 320" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="45" cy="40" r="18" fill="none" stroke="#475569" strokeWidth="0.5" />
        <text x="45" y="28" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="500">N</text>
        <line x1="45" y1="55" x2="45" y2="30" stroke="#cbd5e1" strokeWidth="1.2" />
      </g>

      {showSaintAmour && (
        <g>
          <text x="660" y="58" textAnchor="end" fontSize="10" fill="#64748b">Saint-Amour (NE)</text>
          <line x1="630" y1="64" x2="610" y2="78" stroke="#64748b" strokeWidth="0.4" strokeDasharray="2 2" />
        </g>
      )}

      {showPattern && (
        <g>
          <rect x="130" y="78" width="420" height="46" fill="none" stroke="#a78bfa" strokeWidth="0.7" strokeDasharray="5 4" />
          <text x="340" y="72" textAnchor="middle" fontSize="9" fill="#a78bfa">vent arrière main droite piste 27</text>
          <path d="M 220 101 L 280 101" stroke="#a78bfa" strokeWidth="0.8" fill="none" />
          <polygon points="278,98 286,101 278,104" fill="#a78bfa" />
        </g>
      )}

      <rect x="80" y="120" width="540" height="22" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
      <text x="70" y="135" textAnchor="end" fontSize="11" fill="#e2e8f0" fontWeight="600">09</text>
      <text x="630" y="135" textAnchor="start" fontSize="11" fill="#e2e8f0" fontWeight="600">27</text>
      {[92, 98, 104].map((x) => (
        <line key={'l' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
      ))}
      {[596, 602, 608].map((x) => (
        <line key={'r' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
      ))}

      <rect x="546" y="142" width="6" height="38" fill="#334155" />
      <line x1="540" y1="148" x2="558" y2="148" stroke="#ef4444" strokeWidth="1.5" />
      <text x="565" y="158" textAnchor="start" fontSize="8" fill="#94a3b8">H2</text>

      <rect x="120" y="178" width="430" height="4" fill="#334155" />

      <rect x="280" y="200" width="180" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
      <text x="370" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Parking principal</text>
      <text x="300" y="238" textAnchor="middle" fontSize="8" fill="#64748b">A2</text>
      <text x="340" y="238" textAnchor="middle" fontSize="8" fill="#64748b">B1</text>
      <text x="380" y="238" textAnchor="middle" fontSize="8" fill="#64748b">C1</text>

      <rect x="180" y="200" width="60" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
      <text x="210" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Aéroclub D</text>
      <text x="210" y="236" textAnchor="middle" fontSize="8" fill="#64748b">D1 D2</text>

      <rect x="490" y="200" width="50" height="28" fill="#7c2d12" fillOpacity="0.35" stroke="#d97706" strokeWidth="0.5" rx="2" />
      <text x="515" y="218" textAnchor="middle" fontSize="8" fill="#fcd34d">SSLIA</text>

      <circle cx="370" cy="265" r="4" fill="#475569" />
      <text x="382" y="269" textAnchor="start" fontSize="8" fill="#94a3b8">TWR</text>

      <rect x="540" y="85" width="50" height="22" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="2" />
      <text x="565" y="100" textAnchor="middle" fontSize="8" fill="#94a3b8">Local tech.</text>

      {aircraft.map((ac) => (
        <g
          key={ac.id}
          style={{ transition: 'transform 1500ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          transform={'translate(' + ac.x + ', ' + ac.y + ')'}
        >
          {ac.type === 'vehicle' ? (
            <rect x="-7" y="-5" width="14" height="10" fill={COLORS.vehicle} stroke="#92400e" strokeWidth="0.5" rx="1" />
          ) : (
            <polygon
              points="0,-9 6,6 0,3 -6,6"
              fill={COLORS[ac.type]}
              stroke="#0f172a"
              strokeWidth="0.6"
              transform={'rotate(' + (ac.heading || 0) + ')'}
            />
          )}
          <text x="0" y="-14" textAnchor="middle" fontSize="10" fill={COLORS[ac.type]} fontWeight="600">
            {ac.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function getIconForScenario(iconName) {
  switch (iconName) {
    case 'plane':
      return Plane;
    case 'shuffle':
      return Shuffle;
    case 'truck':
      return Truck;
    case 'alert':
      return AlertTriangle;
    default:
      return Layers;
  }
}

function ScenarioMenu({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Radio className="w-7 h-7 text-amber-400" />
            <h1 className="text-2xl font-semibold tracking-wide">AURIOL TWR · Simulateur</h1>
          </div>
          <p className="text-sm text-slate-400">
            Choisis un scénario. Chacun te présente une situation extraite des livrets BASIC TWR avec carte interactive,
            corrections et notes pédagogiques.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((scenario, idx) => {
            const Icon = getIconForScenario(scenario.icon);
            return (
              <button
                key={scenario.id}
                onClick={() => onSelect(idx)}
                className="text-left bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-amber-400/40 hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{ backgroundColor: scenario.color + '20', borderColor: scenario.color + '60' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: scenario.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="font-semibold text-slate-100 truncate">{scenario.title}</h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium flex-shrink-0"
                        style={{ backgroundColor: scenario.color + '20', color: scenario.color }}
                      >
                        {scenario.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{scenario.description}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500">
                      <span>RWY {scenario.setup.rwy}</span>
                      <span>{scenario.setup.wind}</span>
                      <span>QNH {scenario.setup.qnh}</span>
                      <span className="ml-auto">{scenario.steps.length} étapes</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800">
          Simulateur d'entraînement BASIC TWR — basé sur les livrets ENAC. Aérodrome fictif d'AURIOL (LFVA), fréquence
          119.000 MHz.
        </div>
      </div>
    </div>
  );
}

export default function ATCSimulator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(null);
  const [step, setStep] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [revealed, setRevealed] = useState(false);

  if (selectedScenarioIndex === null) {
    return (
      <ScenarioMenu
        onSelect={(idx) => {
          setSelectedScenarioIndex(idx);
          setStep(0);
          setUserResponse('');
          setRevealed(false);
        }}
      />
    );
  }

  const scenario = SCENARIOS[selectedScenarioIndex];
  const steps = scenario.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const needsResponse = current.expectedResponse !== null;

  const handleReveal = () => setRevealed(true);
  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
      setUserResponse('');
      setRevealed(false);
    }
  };
  const handleReset = () => {
    setStep(0);
    setUserResponse('');
    setRevealed(false);
  };
  const handleBackToMenu = () => {
    setSelectedScenarioIndex(null);
    setStep(0);
    setUserResponse('');
    setRevealed(false);
  };

  const speakerIsSecu = current.speaker.role === 'SECU';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBackToMenu}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -ml-1"
              aria-label="Retour au menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="text-base font-semibold tracking-wide">AURIOL TWR</h1>
              <p className="text-xs text-slate-400">{scenario.title}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-amber-300">{current.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono">{scenario.setup.wind}</span>
            </div>
            <div className="font-mono">
              <span className="text-slate-500">RWY </span>
              <span className="text-amber-300 font-semibold">{scenario.setup.rwy}</span>
            </div>
            <div className="font-mono">
              <span className="text-slate-500">QNH </span>
              <span className="text-amber-300 font-semibold">{scenario.setup.qnh}</span>
            </div>
          </div>
        </header>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <AirportMap
            aircraft={current.aircraft}
            showPattern={current.showPattern}
            showSaintAmour={current.showSaintAmour}
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-mono">
            {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-700 ease-out"
              style={{ width: ((step + 1) / steps.length) * 100 + '%' }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {current.speaker.role === 'INFO' ? (
            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-700 border-dashed rounded-lg p-3.5">
              <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">{current.message}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700">
                {speakerIsSecu ? (
                  <Truck className="w-5 h-5" style={{ color: COLORS.vehicle }} />
                ) : (
                  <Plane className="w-5 h-5" style={{ color: COLORS[current.speaker.color] }} />
                )}
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: COLORS[current.speaker.color] }}
                  >
                    {current.speaker.role} · {current.speaker.callsign}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{current.time}</span>
                </div>
                <p className="text-slate-100 italic">« {current.message} »</p>
              </div>
            </div>
          )}

          {needsResponse && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Ta réponse (optionnelle)
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Formule ta réponse de contrôleur..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 resize-none placeholder:text-slate-600"
                rows={3}
                disabled={revealed}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {needsResponse && !revealed && (
              <button
                onClick={handleReveal}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg hover:bg-amber-500/25 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Voir la correction
              </button>
            )}
            {(revealed || !needsResponse) && !isLast && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-lg hover:bg-emerald-500/25 transition-colors text-sm font-medium"
              >
                Étape suivante
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {isLast && (revealed || !needsResponse) && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recommencer
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Choisir un autre scénario
                </button>
              </>
            )}
          </div>

          {revealed && needsResponse && (
            <div className="space-y-3 mt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/40">
                  <Radio className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 bg-amber-500/5 border border-amber-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">AURIOL Tour</span>
                    <span className="text-xs text-slate-500">Réponse attendue</span>
                  </div>
                  <p className="text-slate-100">« {current.expectedResponse} »</p>
                </div>
              </div>

              {current.teaching && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                      Note pédagogique
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{current.teaching}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLast && (revealed || !needsResponse) && (
            <div className="mt-6 p-6 bg-slate-800 border border-emerald-500/30 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h2 className="text-lg font-semibold">Scénario terminé</h2>
              <p className="text-sm text-slate-400">
                Tu as géré « {scenario.title} ». Recommence pour t'entraîner sur la fluidité, ou choisis un autre
                scénario pour varier les situations.
              </p>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800">
          Lis le message, formule mentalement (ou tape) ta réponse, puis vérifie la correction et la note pédagogique
          avant de passer à la suite.
        </div>
      </div>
    </div>
  );
}

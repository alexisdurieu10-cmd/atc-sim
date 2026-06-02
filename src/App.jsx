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
    time: '08:20:00',
    speaker: { role: 'INFO' },
    message:
      "Situation initiale. Piste 27 en service, vent 250°/10 kt, QNH 1020. Strips au tableau : FDVEN (TBM7, LFLB→LFVA via Penent, A/D 08:40) en approche depuis l'est. GBANC (DA42) au poste A2, prêt au départ vers LFPN via Saint-Amour. FBVXN (DR400) au poste C1, demande tour de piste. Deux strips vierges à remplir pour GBANC et FBVXN.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 760, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 350, y: 245, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 2,
    time: '08:35:00',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'AURIOL Tour, FDVEN, demande approche directe piste 27',
    expectedResponse: 'FDVEN, exécutez approche directe piste 27, rappelez longue finale',
    teaching:
      "Première communication — pilote et contrôleur utilisent le callsign complet (FDVEN). F-EN (TBM7) arrive de l'est via Penent. Approche directe autorisée sur demande du pilote. On demande le rappel longue finale. Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 730, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 350, y: 245, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 3,
    time: '08:38:00',
    speaker: { role: 'PILOTE', callsign: 'G-NC', color: 'departure' },
    message: 'AURIOL Tower, GBANC, DA42, stand A2, to TOUSSUS-LE-NOBLE via Saint-Amour, request taxi',
    expectedResponse: "GBANC, runway 27 in use, wind 250°/10 kt, QNH 1020, taxi holding point runway 27",
    teaching:
      "Première communication — on répond avec le callsign complet (GBANC). Appel en anglais — on répond en anglais. Clairance de roulage standard : piste en service, vent, QNH, instruction. Strip rouge (départ).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 700, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 350, y: 245, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 4,
    time: '08:39:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'AURIOL Tour, FBVXN, DR400, poste C1, demande roulage pour un tour de piste',
    expectedResponse:
      "FBVXN, piste 27 en service, vent 250°/10 kt, QNH 1020, laissez passer le DA42 du parking principal vers le point d'attente piste 27, puis roulez point d'attente piste 27",
    teaching:
      "Première communication — on répond avec le callsign complet (FBVXN). G-NC (A2) et F-XN (C1) convergent vers le même point d'attente. G-NC ayant appelé en premier, il est prioritaire. « Laissez passer » prescrit l'ordre de roulage. Strip rouge+bleu (tour de piste).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 670, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 350, y: 245, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 5,
    time: '08:39:30',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, longue finale piste 27',
    expectedResponse: 'F-EN, numéro 1, rappelez finale piste 27',
    teaching:
      "F-EN est en longue finale approche directe. On donne le numéro d'ordre (n°1, piste libre) et on demande le rappel finale — la clairance d'atterrissage sera donnée à ce rappel.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 650, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 373, y: 188, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 225, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 6,
    time: '08:41:00',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, finale piste 27',
    expectedResponse: 'F-EN, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-EN est en finale. Piste libre — G-NC et F-XN encore au sol. On autorise l'atterrissage et on redonne le vent. La piste est occupée dès cette clairance.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 625, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 373, y: 158, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 210, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 7,
    time: '08:42:20',
    speaker: { role: 'INFO' },
    message:
      "F-EN a atterri et dépassé l'intersection H2. G-NC et F-XN ont atteint le point d'attente piste 27 (G-NC en premier, F-XN derrière). Trois appels arrivent simultanément.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 320, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 373, y: 158, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 174, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 8,
    time: '08:42:30',
    speaker: { role: 'PILOTE', callsign: 'G-NC', color: 'departure' },
    message: 'G-NC, ready, request backtrack runway 27',
    expectedResponse: 'G-NC, backtrack runway 27, line up and wait',
    teaching:
      "G-NC demande un backtrack pour utiliser toute la piste. On autorise remontée + alignement + ATTENTE — pas encore de décollage car F-EN est encore sur la piste. Strip de G-NC placé sur la barrette piste.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 250, y: 132, label: 'F-EN', heading: 270 },
      { id: 'G-NC', type: 'departure', x: 373, y: 158, label: 'G-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 174, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 9,
    time: '08:43:00',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, piste dégagée, demande roulage pour le parking',
    expectedResponse: 'F-EN, roulez poste A4',
    teaching:
      "F-EN a libéré la piste — on lui attribue le poste A4 (TBM700 au parking principal). Strip de F-EN passe sous la barrette (roulage).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 97, y: 160, label: 'F-EN', heading: 180 },
      { id: 'G-NC', type: 'departure', x: 615, y: 132, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 10,
    time: '08:43:30',
    speaker: { role: 'INFO' },
    message:
      "F-EN vient de dégager la piste. G-NC est aligné au seuil 27 après backtrack, en attente. F-XN attend au point d'attente H2. La piste est libre — c'est à la tour d'initier la clairance décollage.",
    expectedResponse: 'G-NC, runway 27 cleared for takeoff, wind 250°/10 kt',
    teaching:
      "Après un « line up and wait », l'avion aligné ne rappelle pas — la tour prend l'initiative dès que la piste est libre. Aucun trafic en approche → clairance décollage immédiate.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 210, y: 245, label: 'F-EN', heading: 0 },
      { id: 'G-NC', type: 'departure', x: 615, y: 132, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 11,
    time: '08:44:00',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'AURIOL Tour, SÉCURITÉ, demande à procéder du SSLIA au local technique',
    expectedResponse: "SÉCURITÉ, procédez point d'attente piste 27",
    teaching:
      "Piste 27 en service → « point d'attente piste 27 ». G-NC décolle en ce moment — piste occupée. F-XN va démarrer sa remontée une fois la piste libre. SÉCURITÉ doit attendre.",
    aircraft: [
      { id: 'G-NC', type: 'departure', x: 480, y: 132, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 158, label: 'F-XN', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 12,
    time: '08:44:10',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, prêt, demande remontée piste 27',
    expectedResponse: 'F-XN, remontez piste 27, alignez-vous, attendez',
    teaching:
      "G-NC vient de franchir l'extrémité de piste — piste libre. F-XN peut remonter et s'aligner. On donne « attendez » car DA42 est encore en montée initiale et SÉCU se dirige vers le point d'attente. Strip de F-XN placé sur la barrette piste.",
    aircraft: [
      { id: 'G-NC', type: 'departure', x: 80, y: 132, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 158, label: 'F-XN', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 460, y: 180, label: 'SÉCU' },
    ],
  },
  {
    id: 13,
    time: '08:44:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message:
      'AURIOL Tour, FNMVH, Cessna 172, provenance RENNES via Julienas, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'FNMVH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, trafic au départ vers vent arrière, DA42, rappelez vent arrière',
    teaching:
      "Première communication — on répond avec le callsign complet (FNMVH). F-VH arrive de Julienas (Nord) → intégration directe en vent arrière main droite, pas de vertical tour. On informe du trafic (DA42 = G-NC en montée initiale). Strip bleu (arrivée).",
    aircraft: [
      { id: 'G-NC', type: 'departure', x: 50, y: 110, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 540, y: 132, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 50, y: 20, label: 'F-VH', heading: 135 },
      { id: 'SECU', type: 'vehicle', x: 440, y: 180, label: 'SÉCU' },
    ],
  },
  {
    id: 14,
    time: '08:45:00',
    speaker: { role: 'INFO' },
    message:
      "F-XN est aligné au seuil 27 après remontée complète, en attente. G-NC (DA42) s'éloigne en montée initiale. F-VH (C172 de Julienas) s'approche depuis le Nord-Ouest vers le vent arrière. La piste est libre — c'est à la tour d'initier la clairance décollage.",
    expectedResponse:
      'F-XN, trafic de Julienas vers vent arrière, Cessna 172, trafic au départ vers vent arrière, DA42, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27 — puis : F-VH, trafic DR400 au départ vers vent arrière',
    teaching:
      "Après « alignez-vous, attendez », la tour initie la clairance dès que la piste est libre. Tous les trafics conflictuels sont signalés : DA42 en montée initiale ET Cessna 172 (F-VH de Julienas) entrant en vent arrière depuis le NW — leurs trajectoires se croisent au NW. Info réciproque obligatoire : donner aussi à F-VH le trafic DR400 au départ. Ordre : infos trafic → autorisation → vent → rappel.",
    aircraft: [
      { id: 'G-NC', type: 'departure', x: 30, y: 80, label: 'G-NC', heading: 315 },
      { id: 'F-XN', type: 'circuit', x: 615, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 155, y: 60, label: 'F-VH', heading: 135 },
      { id: 'SECU', type: 'vehicle', x: 373, y: 158, label: 'SÉCU' },
    ],
  },
  {
    id: 15,
    time: '08:45:30',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'SÉCURITÉ, demande traversée piste 27',
    expectedResponse: 'SÉCURITÉ, traversez piste 27',
    teaching:
      "F-XN vient de décoller et a dépassé l'extrémité de piste — piste libre. G-NC est en départ vers Saint-Amour. Pas de conflit : traversée autorisée.",
    aircraft: [
      { id: 'G-NC', type: 'departure', x: 10, y: 30, label: 'G-NC', heading: 315 },
      { id: 'F-XN', type: 'circuit', x: 40, y: 110, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 100, y: 30, label: 'F-VH', heading: 135 },
      { id: 'SECU', type: 'vehicle', x: 373, y: 170, label: 'SÉCU' },
    ],
  },
  {
    id: 16,
    time: '08:46:00',
    speaker: { role: 'PILOTE', callsign: 'G-TZ', color: 'circuit' },
    message:
      'AURIOL Tower, GBATZ, Transall, from ORLEANS via Morgon, airfield estimated in 5 minutes, for a touch and go, then back to ORLEANS via Saint-Amour',
    expectedResponse:
      'GBATZ, runway 27 in use, wind 250°/10 kt, QNH 1020, join right hand downwind runway 27 via overhead tower, report overhead tower',
    teaching:
      "Première communication — on répond avec le callsign complet (GBATZ). G-TZ arrive depuis Morgon (Sud) → vertical tour obligatoire. Le QNH est donné pour le réglage altimétrique. Strip rouge+bleu. Pilote anglais — on répond en anglais.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 70, y: 85, label: 'F-XN', heading: 0 },
      { id: 'F-VH', type: 'arrival', x: 150, y: 50, label: 'F-VH', heading: 135 },
      { id: 'G-TZ', type: 'arrival', x: 370, y: 390, label: 'G-TZ', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 373, y: 95, label: 'SÉCU' },
    ],
  },
  {
    id: 17,
    time: '08:46:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, vent arrière main droite piste 27',
    expectedResponse:
      "F-XN, numéro 1, rappelez finale piste 27",
    teaching:
      "F-XN est seul dans le circuit. Numéro 1, rappel en finale.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 260, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 180, y: 90, label: 'F-VH', heading: 135 },
      { id: 'G-TZ', type: 'arrival', x: 370, y: 320, label: 'G-TZ', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 18,
    time: '08:47:00',
    speaker: { role: 'PILOTE', callsign: 'G-TZ', color: 'circuit' },
    message: 'G-TZ, overhead tower',
    expectedResponse:
      'G-TZ, traffic from Julienas entering downwind, Cessna 172, report downwind — puis : F-VH, trafic de vertical tour vers vent arrière, Transall',
    teaching:
      "G-TZ passe le vertical — il n'est pas encore dans le circuit (vent montant puis vent arrière à venir). F-VH (C172 de Julienas) approche depuis le NW : leurs trajectoires se croisent dans le secteur NW. Info trafic obligatoire dans les deux sens (livret 4). Le numéro d'ordre sera donné à son rappel vent arrière.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 350, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 185, y: 96, label: 'F-VH', heading: 135 },
      { id: 'G-TZ', type: 'arrival', x: 370, y: 260, label: 'G-TZ', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 19,
    time: '08:47:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un DR400 en vent arrière, rappelez finale',
    teaching:
      "F-VH intègre le vent arrière derrière F-XN (DR400, n°1). Séquencement : n°2, suivre le DR400 visuellement. Rappel en finale (car F-VH sera le prochain à atterrir).",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 430, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 270, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'arrival', x: 310, y: 225, label: 'G-TZ', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 20,
    time: '08:48:00',
    speaker: { role: 'PILOTE', callsign: 'G-NC', color: 'departure' },
    message: 'G-NC, leaving frequency, goodbye',
    expectedResponse: 'G-NC, roger, goodbye',
    teaching:
      "G-NC quitte la fréquence pour rejoindre Toussus-le-Noble. On accuse réception sobrement. On note l'heure de dernier contact sur le strip puis on l'archive.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 490, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 330, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'arrival', x: 200, y: 175, label: 'G-TZ', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 21,
    time: '08:49:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, numéro 1, DR400 sur la piste, rappelez courte finale',
    teaching:
      "F-XN (DR400) vient d'atterrir et effectue son toucher-roulé-décollage — il est encore sur la piste. Piste occupée : on ne peut pas autoriser l'atterrissage. On donne le numéro d'ordre (n°1) et on informe F-VH du DR400 sur la piste. Le rappel courte finale permet de réévaluer la situation juste avant.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 350, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'arrival', x: 100, y: 130, label: 'G-TZ', heading: 0 },
    ],
  },
  {
    id: 22,
    time: '08:49:30',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'AURIOL Tour, FBVEP, Beech 200, poste B2, destination COLMAR via Nord-Est, demande roulage',
    expectedResponse: "FBVEP, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — on répond avec le callsign complet (FBVEP). F-EP (BE20) est au poste B2 — pas de conflit de roulage. Clairance de roulage standard. Strip rouge (départ).",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 280, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'arrival', x: 100, y: 108, label: 'G-TZ', heading: 0 },
      { id: 'F-EP', type: 'departure', x: 320, y: 245, label: 'F-EP', heading: 0 },
    ],
  },
  {
    id: 23,
    time: '08:50:00',
    speaker: { role: 'INFO' },
    message:
      "F-XN (DR400) a effectué son toucher et redécolle. La piste restera occupée jusqu'à ce que F-XN franchisse l'extrémité — notez l'heure précise (08:50:05) pour un éventuel délai de turbulence de sillage. G-TZ (Transall, catégorie M) est maintenant en vent arrière.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 130, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'circuit', x: 420, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 180, label: 'F-EP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 24,
    time: '08:50:30',
    speaker: { role: 'PILOTE', callsign: 'G-TZ', color: 'circuit' },
    message: 'G-TZ, right hand downwind runway 27',
    expectedResponse: 'G-TZ, number 2, follow a Cessna 172 on short final, report final',
    teaching:
      "G-TZ (Transall) entre en vent arrière. F-VH (Cessna 172) est en courte finale. On séquence G-TZ en n°2 derrière F-VH et on demande le rappel finale. Attention : F-XN est encore sur la piste — la situation va évoluer.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 95, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'circuit', x: 460, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 25,
    time: '08:50:45',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, courte finale',
    expectedResponse:
      'F-VH, remettez les gaz, rappelez vent arrière piste 27 — puis : G-TZ, Cessna 172 going around, you are number 1, report final',
    teaching:
      "F-XN n'a pas encore franchi l'extrémité de piste — piste toujours occupée. On commande la remise de gaz. F-VH perd son numéro au seuil de piste. L'heure RMG est notée avec une flèche (→) sur le strip. G-TZ devient n°1 : on l'informe immédiatement dans la foulée, sans attendre qu'il rappelle.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 60, y: 90, label: 'F-XN', heading: 315 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'circuit', x: 490, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
    ],
  },
  {
    id: 26,
    time: '08:51:30',
    speaker: { role: 'PILOTE', callsign: 'G-ML', color: 'transit' },
    message:
      'AURIOL Tower, GBHML, Tobago, transit from DIJON to NICE via North, 3000 ft QNH, over airfield estimated in 5 minutes, exit via Fleurie',
    expectedResponse: 'GBHML, runway 27 in use, QNH 1020, report overhead airfield',
    teaching:
      "Première communication — on répond avec le callsign complet (GBHML). Transit VFR : on donne la piste en service et le QNH. G-ML est à 3000 ft QNH, le circuit à 1400 ft — pas de conflit d'altitude.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 175, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 550, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'G-ML', type: 'transit', x: 370, y: 35, label: 'G-ML', heading: 180 },
    ],
    showPattern: true,
  },
  {
    id: 27,
    time: '08:52:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, je quitte la fréquence, au parking',
    expectedResponse: 'F-XN, roger, au revoir',
    teaching:
      "F-XN a complété son tour de piste et roule vers le parking. On accuse réception, on note l'heure de dernier contact, on archive le strip.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200 , y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 570, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'G-ML', type: 'transit', x: 370, y: 155, label: 'G-ML', heading: 180 },
    ],
    showPattern: true,
  },
  {
    id: 28,
    time: '08:52:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message:
      'AURIOL Tour, FBXYH, Cessna 172, provenance RODEZ via le Sud-Ouest, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'FBXYH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, trafic du Nord vers vertical, Tobago, rappelez vertical tour — puis : G-ML, traffic from the South-West towards overhead, Cessna 172',
    teaching:
      "Première communication — callsign complet (FBXYH). F-YH arrive du SW → vertical tour obligatoire. G-ML (Tobago) et F-YH convergent tous deux vers le vertical depuis des directions opposées (livret 6, p.29) : chacun doit être informé de l'autre. Donner l'info à F-YH (déjà dans la réponse) ET la réciproque à G-ML. Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 570, y: 100, label: 'G-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'G-ML', type: 'transit', x: 370, y: 185, label: 'G-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 70, y: 375, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 29,
    time: '08:52:50',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un Transall en finale, rappelez finale',
    teaching:
      "F-VH a effectué sa remise de gaz et a rejoint le vent arrière. G-TZ (Transall) est en finale → F-VH est n°2. Séquencement : numéro, suivre, rappel finale.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 280, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 605, y: 132, label: 'G-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'G-ML', type: 'transit', x: 370, y: 235, label: 'G-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 160, y: 355, label: 'F-YH', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 30,
    time: '08:53:00',
    speaker: { role: 'PILOTE', callsign: 'G-ML', color: 'transit' },
    message: 'G-ML, overhead airfield',
    expectedResponse: 'G-ML, roger',
    teaching:
      "G-ML passe le vertical aérodrome à 3000 ft. On accuse réception. Le pilote rappellera de lui-même en quittant la zone (standard VFR) — step suivant.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 320, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 605, y: 132, label: 'G-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'G-ML', type: 'transit', x: 370, y: 260, label: 'G-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 260, y: 305, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 31,
    time: '08:53:30',
    speaker: { role: 'PILOTE', callsign: 'G-TZ', color: 'circuit' },
    message: 'G-TZ, final runway 27 for a touch and go',
    expectedResponse: 'G-TZ, runway 27 cleared touch and go, wind 250°/10 kt',
    teaching:
      "Piste libre. On autorise le toucher du Transall. On note précisément l'heure du lever des roues (hh:mm:ss) : F-VH (C172, cat. L) suit G-TZ (Transall, cat. M) → si F-VH atterrit dans le sillage du Transall sur le même axe, un délai de 3 minutes s'applique. Ici les trajectoires divergeront (G-TZ repart vers le Nord, F-VH atterrit vers l'Ouest) — voir étape suivante.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 380, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 605, y: 132, label: 'G-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 350, y: 270, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 32,
    time: '08:54:00',
    speaker: { role: 'PILOTE', callsign: 'G-ML', color: 'transit' },
    message: 'G-ML, Fleurie, leaving frequency',
    expectedResponse: 'G-ML, roger, goodbye',
    teaching:
      "G-ML passe Fleurie et quitte la fréquence pour contacter l'organisme suivant. Accusé de réception, heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 430, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 300, y: 132, label: 'G-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 340, y: 295, label: 'F-YH', heading: 30 },
    ],
  },
  {
    id: 33,
    time: '08:54:20',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vertical tour',
    expectedResponse: 'F-YH, trafic en vent arrière, Cessna 172, rappelez vent arrière',
    teaching:
      "F-YH passe le vertical tour. F-VH (Cessna 172) est en vent arrière devant lui — info trafic obligatoire pour le séquencement à venir. F-YH sera numéro 2 derrière F-VH ; le numéro sera donné au rappel vent arrière.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 460, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'circuit', x: 175, y: 132, label: 'G-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 370, y: 260, label: 'F-YH', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 34,
    time: '08:55:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "G-TZ (Transall, cat. M) a touché et redécollé vers le Nord. F-VH (C172, cat. L) atterrit sur la piste 27 — les trajectoires divergent (Transall part au Nord, C172 atterrit à l'Ouest). Pas de problème de turbulence de sillage sur l'axe d'atterrissage. Piste libre : atterrissage autorisé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'G-TZ', type: 'circuit', x: 130, y: 50, label: 'G-TZ', heading: 45 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 290, y: 220, label: 'F-YH', heading: 315 },
    ],
  },
  {
    id: 35,
    time: '08:55:30',
    speaker: { role: 'PILOTE', callsign: 'G-TZ', color: 'circuit' },
    message: 'G-TZ, leaving frequency, back to Orléans via Saint-Amour',
    expectedResponse: 'G-TZ, roger, goodbye',
    teaching:
      "G-TZ a accompli son toucher-roulé-décollage et quitte la fréquence pour rentrer à Orléans via Saint-Amour (NE). Strip archivé avec heure de dernier contact.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 140, y: 180, label: 'F-VH', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 185, y: 165, label: 'F-YH', heading: 315 },
    ],
  },
  {
    id: 36,
    time: '08:56:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, piste dégagée, demande roulage',
    expectedResponse: 'F-VH, roulez poste D1',
    teaching:
      "F-VH libère la piste. On lui attribue le poste D1 (parking aéroclub). Note Livret 2 : le parking D n'est pas visible depuis la tour — si le pilote avait demandé lui-même « parking D », on n'aurait pas à lui désigner de poste spécifique.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 140, y: 180, label: 'F-VH', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 380, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 37,
    time: '08:57:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, prêt, demande remontée piste 27',
    expectedResponse: "F-EP, maintenez avant point d'attente piste 27, Cessna 172 en vent arrière",
    teaching:
      "Verrou de piste piste 27 pour une remontée : la piste est verrouillée dès que l'arrivée passe le travers tour en vent arrière. F-YH est en vent arrière et a dépassé le travers tour → on maintient F-EP au point d'attente avec l'info trafic.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 38,
    time: '08:57:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vent arrière main droite piste 27',
    expectedResponse: 'F-YH, numéro 1, rappelez finale piste 27',
    teaching:
      "F-YH est seul dans le circuit. Numéro 1, rappel en finale. F-EP reste au point d'attente — le verrou reste actif tant que F-YH n'a pas dégagé la piste.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 480, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 39,
    time: '08:58:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, finale piste 27',
    expectedResponse: 'F-YH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-YH est en finale. Piste libre. Atterrissage autorisé. F-EP reste maintenu — on attend que F-YH atterrisse et dégage la piste avant d'autoriser la remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 605, y: 132, label: 'F-YH', heading: 270 },
    ],
  },
  {
    id: 40,
    time: '08:59:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, piste dégagée, demande roulage',
    expectedResponse: 'F-YH, roulez poste C3',
    teaching:
      "F-YH a libéré la piste — poste C3 attribué (C172 au parking principal). La piste est maintenant disponible pour F-EP. On peut enchaîner immédiatement avec la clairance de remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 140, y: 180, label: 'F-YH', heading: 90 },
    ],
  },
  {
    id: 41,
    time: '09:00:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, prêt',
    expectedResponse: 'F-EP, remontez piste 27, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt',
    teaching:
      "Piste libre, aucun trafic en approche. Quand le trafic le permet et qu'aucun conflit n'est prévisible, on peut combiner remontée + alignement + décollage en une seule clairance. F-EP (BE20) partira vers COLMAR via Nord-Est. Scénario terminé — 40 minutes de simulation de 08:20 à 09:00.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 615, y: 132, label: 'F-EP', heading: 270 },
      { id: 'F-YH', type: 'arrival', x: 350, y: 245, label: 'F-YH', heading: 0 },
    ],
  },
];

const SCENARIO_2_STEPS = [
  ...SCENARIO_1_STEPS.slice(0, 40),
  {
    ...SCENARIO_1_STEPS[40],
    teaching:
      "Piste libre, aucun trafic en approche. Quand le trafic le permet et qu'aucun conflit n'est prévisible, on peut combiner remontée + alignement + décollage en une seule clairance. F-EP (BE20) décolle vers Colmar via Nord-Est.",
  },
  {
    id: 42,
    time: '09:02:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, je quitte la fréquence, au revoir',
    expectedResponse: 'F-EP, roger, au revoir',
    teaching:
      "F-EP (BE20) quitte la zone vers Colmar. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 630, y: 50, label: 'F-EP', heading: 45 },
      { id: 'F-YH', type: 'arrival', x: 390, y: 245, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 43,
    time: '09:03:00',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, je quitte la fréquence, au revoir',
    expectedResponse: 'F-YH, roger, au revoir',
    teaching:
      "F-YH au parking C3. Strip archivé. Fréquence calme — bon moment pour vérifier les strips en attente et anticiper le prochain trafic.",
    aircraft: [
      { id: 'F-YH', type: 'arrival', x: 390, y: 245, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 44,
    time: '09:05:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message:
      'AURIOL Tour, FGDLN, Piper Cherokee, provenance AVIGNON via Morgon, aérodrome estimé dans 10 minutes, pour atterrissage',
    expectedResponse:
      'FGDLN, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, rappelez vertical tour',
    teaching:
      "Première communication — callsign complet (FGDLN). Arrivée depuis Morgon (Sud) → vertical tour obligatoire, règle absolue pour toute arrivée du Sud. Symbole ⊥ noté sur le strip bleu.",
    aircraft: [
      { id: 'F-LN', type: 'arrival', x: 370, y: 390, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 45,
    time: '09:06:00',
    speaker: { role: 'PILOTE', callsign: 'F-NI', color: 'departure' },
    message:
      'AURIOL Tour, FBCNI, DR400, poste A2, destination LILLE via Saint-Amour, demande roulage',
    expectedResponse:
      "FBCNI, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet (FBCNI). Poste A2, pas de conflit de roulage. Strip rouge (départ), route STA (Saint-Amour). Callsign abrégé : F-NI.",
    aircraft: [
      { id: 'F-NI', type: 'departure', x: 310, y: 245, label: 'F-NI', heading: 0 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 345, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 46,
    time: '09:08:00',
    speaker: { role: 'PILOTE', callsign: 'F-NI', color: 'departure' },
    message: "F-NI, prêt, demande remontée piste 27",
    expectedResponse: "F-NI, remontez piste 27, alignez-vous, attendez",
    teaching:
      "F-NI (DR400) au point d'attente H2. FGDLN n'est pas encore au vertical → verrou inactif. On autorise la remontée et l'alignement. « Attendez » car la situation trafic évolue.",
    aircraft: [
      { id: 'F-NI', type: 'departure', x: 373, y: 158, label: 'F-NI', heading: 0 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 295, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 47,
    time: '09:09:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'arrival' },
    message:
      'AURIOL Tour, FBVHC, Cessna 172, provenance RENNES via Julienas, aérodrome estimé dans 8 minutes, pour atterrissage',
    expectedResponse:
      'FBVHC, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "Première communication — callsign complet (FBVHC). Julienas (Nord) → intégration directe en vent arrière main droite, sans vertical tour. F-NI est aligné sur la piste en attente.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 100, y: 30, label: 'F-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 615, y: 132, label: 'F-NI', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 48,
    time: '09:10:00',
    speaker: { role: 'INFO' },
    message:
      "F-NI est aligné au seuil 27 en attente. Pas de trafic en finale. F-HC (C172 de Julienas) s'approche depuis le Nord-Ouest — sa trajectoire et celle de F-NI au départ vers Saint-Amour se croisent au NW. C'est à la tour d'initier la clairance décollage.",
    expectedResponse:
      "F-NI, trafic de Julienas vers vent arrière, Cessna 172, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27 — puis : F-HC, trafic au départ vers Saint-Amour, DR400",
    teaching:
      "La tour initie après « alignez-vous, attendez ». Trajectoires croisées au NW entre F-NI (départ Saint-Amour) et F-HC (arrivée Julienas) → info trafic réciproque obligatoire. Même situation que l'étape 14 du scénario 1.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 130, y: 50, label: 'F-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 615, y: 132, label: 'F-NI', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 230, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 49,
    time: '09:12:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vertical tour',
    expectedResponse:
      'F-LN, trafic de Julienas vers vent arrière, Cessna 172, rappelez vent arrière — puis : F-HC, trafic de vertical tour vers vent arrière, Piper Cherokee',
    teaching:
      "FGDLN passe le vertical. F-HC (C172 de Julienas) converge vers le vent arrière depuis le NW → trajectoires croisées (livret 4, p.16). Info trafic dans les deux sens. Le numéro d'ordre de F-LN sera donné à son rappel vent arrière.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 185, y: 75, label: 'F-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 60, y: 100, label: 'F-NI', heading: 315 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 50,
    time: '09:13:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'arrival' },
    message: 'F-HC, vent arrière main droite piste 27',
    expectedResponse: 'F-HC, numéro 1, rappelez finale',
    teaching:
      "F-HC est seule en vent arrière — FGDLN n'a pas encore rappelé vent arrière. Numéro 1, rappel finale. FGDLN intègre le circuit dans quelques instants.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 310, y: 95, label: 'F-HC', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 330, y: 175, label: 'F-LN', heading: 0 },
      { id: 'F-NI', type: 'departure', x: 30, y: 70, label: 'F-NI', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 51,
    time: '09:14:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vent arrière main droite piste 27',
    expectedResponse: 'F-LN, numéro 2, suivez un Cessna 172 en finale, rappelez finale',
    teaching:
      "F-LN intègre le vent arrière. F-HC (n°1) est déjà en finale devant lui. Séquencement : numéro 2, suivre le C172 visuellement, rappel finale.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 570, y: 132, label: 'F-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 230, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 52,
    time: '09:15:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'arrival' },
    message: 'F-HC, finale piste 27',
    expectedResponse: 'F-HC, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-LN est en vent arrière (n°2). Piste libre. Atterrissage autorisé pour F-HC.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 605, y: 132, label: 'F-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 395, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 53,
    time: '09:16:00',
    speaker: { role: 'INFO' },
    message:
      "F-HC (C172) vient de toucher les roues — heure d'atterrissage notée. F-LN (PA28) est en vent arrière et était numéro 2. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'F-LN, numéro 1, rappelez finale',
    teaching:
      "L'avion n°1 perd son numéro au toucher des roues. Le contrôleur actualise immédiatement, sans attendre le prochain rappel de F-LN (livret 4, section 8). F-LN devient n°1 dès le toucher de F-HC.",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 400, y: 132, label: 'F-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 480, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 54,
    time: '09:17:00',
    speaker: { role: 'PILOTE', callsign: 'F-TP', color: 'departure' },
    message:
      'AURIOL Tour, FGCTP, Tobago, poste C1, destination SAINT-ETIENNE via le Sud-Ouest, demande roulage',
    expectedResponse:
      "FGCTP, piste 27 en service, vent 250°/10 kt, QNH 1020, laissez passer le Cessna 172 de la piste vers le parking, puis roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet (FGCTP). Conflit de roulage : F-HC dégage la piste via H2 et emprunte le même taxiway que FGCTP doit utiliser (C1 → H2). On laisse passer l'arrivée, puis on autorise le roulage (livret 4, section 9).",
    aircraft: [
      { id: 'F-HC', type: 'arrival', x: 430, y: 175, label: 'F-HC', heading: 90 },
      { id: 'F-TP', type: 'departure', x: 405, y: 245, label: 'F-TP', heading: 0 },
      { id: 'F-LN', type: 'arrival', x: 545, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 55,
    time: '09:18:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, finale piste 27',
    expectedResponse: 'F-LN, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-HC a dégagé, piste libre. F-LN (PA28) autorisé à atterrir. F-TP attend au parking — il pourra rouler dès que F-HC sera complètement dégagée du taxiway.",
    aircraft: [
      { id: 'F-LN', type: 'arrival', x: 605, y: 132, label: 'F-LN', heading: 270 },
      { id: 'F-TP', type: 'departure', x: 405, y: 245, label: 'F-TP', heading: 0 },
      { id: 'F-HC', type: 'arrival', x: 340, y: 245, label: 'F-HC', heading: 0 },
    ],
  },
  {
    id: 56,
    time: '09:19:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, piste dégagée, demande roulage',
    expectedResponse: 'F-LN, roulez poste B1',
    teaching:
      "F-LN a libéré la piste — poste B1 attribué (PA28 au parking principal). F-TP peut maintenant rouler vers le point d'attente sans conflit.",
    aircraft: [
      { id: 'F-LN', type: 'arrival', x: 373, y: 175, label: 'F-LN', heading: 180 },
      { id: 'F-TP', type: 'departure', x: 405, y: 215, label: 'F-TP', heading: 0 },
    ],
  },
  {
    id: 57,
    time: '09:20:00',
    speaker: { role: 'PILOTE', callsign: 'F-TP', color: 'departure' },
    message: "F-TP, prêt, demande départ de l'intersection",
    expectedResponse: "F-TP, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "F-TP (Tobago) au point d'attente H2, pas de trafic conflictuel. Départ autorisé depuis l'intersection (TORA 500m). Clairance directe, sans remontée.",
    aircraft: [
      { id: 'F-TP', type: 'departure', x: 373, y: 158, label: 'F-TP', heading: 0 },
    ],
  },
  {
    id: 58,
    time: '09:22:00',
    speaker: { role: 'PILOTE', callsign: 'CTM1230', color: 'circuit' },
    message:
      "AURIOL Tour, CTM1230, Transall, provenance ORLÉANS via Julienas, aérodrome estimé dans 5 minutes, pour un toucher piste 27, retour ORLÉANS via Saint-Amour",
    expectedResponse:
      "CTM1230, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, rappelez vent arrière",
    teaching:
      "Première communication — callsign complet CTM1230. Julienas (Nord) → vent arrière main droite direct, sans vertical tour. Strip rouge+bleu (TdP). Sortie Saint-Amour notée sur le strip.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 150, y: 30, label: 'CTM', heading: 135 },
    ],
  },
  {
    id: 59,
    time: '09:23:00',
    speaker: { role: 'PILOTE', callsign: 'F-VD', color: 'departure' },
    message:
      "AURIOL Tour, FBCVD, Cessna 172, poste B2, destination GRENOBLE via Penent, demande roulage",
    expectedResponse:
      "FBCVD, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet (FBCVD). Poste B2, pas de conflit de roulage. Strip rouge (départ), route Penent (Est). Callsign abrégé : F-VD.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 200, y: 60, label: 'CTM', heading: 135 },
      { id: 'F-VD', type: 'departure', x: 340, y: 245, label: 'F-VD', heading: 0 },
    ],
  },
  {
    id: 60,
    time: '09:24:00',
    speaker: { role: 'PILOTE', callsign: 'CTM1230', color: 'circuit' },
    message: "CTM1230, vent arrière main droite piste 27",
    expectedResponse: "CTM1230, numéro 1, rappelez finale",
    teaching: "CTM1230 seul dans le circuit. Numéro 1, rappel finale.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 280, y: 95, label: 'CTM', heading: 90 },
      { id: 'F-VD', type: 'departure', x: 373, y: 185, label: 'F-VD', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 61,
    time: '09:25:00',
    speaker: { role: 'PILOTE', callsign: 'CTM1230', color: 'circuit' },
    message: "CTM1230, finale piste 27 pour un toucher",
    expectedResponse: "CTM1230, piste 27 autorisé toucher, vent 250°/10 kt",
    teaching:
      "Piste libre. CTM1230 (Transall, cat. M) autorisé au toucher. Notez précisément l'heure du lever des roues au redécollage (hh:mm:ss) — F-VD (C172, cat. L) attend au point d'attente H2.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 605, y: 132, label: 'CTM', heading: 270 },
      { id: 'F-VD', type: 'departure', x: 373, y: 158, label: 'F-VD', heading: 0 },
    ],
  },
  {
    id: 62,
    time: '09:26:00',
    speaker: { role: 'INFO' },
    message:
      "CTM1230 (Transall C160, cat. M) vient de toucher et redécolle. Heure du lever des roues notée au format hh:mm:ss. F-VD (C172, cat. L) est au point d'attente H2 et veut décoller sur le même axe piste 27.",
    expectedResponse:
      "F-VD, maintenez avant point d'attente piste 27, cause turbulence de sillage",
    teaching:
      "Turbulence de sillage (livret 5, §3) : CTM1230 (cat. M) vient de lever les roues. F-VD (cat. L, C172) décollerait dans le même sillage sur le même axe. Délai obligatoire : 2 minutes à partir du lever des roues du Transall. On maintient F-VD avec la raison explicite.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 130, y: 132, label: 'CTM', heading: 270 },
      { id: 'F-VD', type: 'departure', x: 373, y: 158, label: 'F-VD', heading: 0 },
    ],
  },
  {
    id: 63,
    time: '09:28:00',
    speaker: { role: 'INFO' },
    message:
      "2 minutes se sont écoulées depuis le lever des roues du Transall. La turbulence de sillage est dissipée. F-VD (C172) est toujours au point d'attente. CTM1230 s'éloigne vers Saint-Amour. Piste et finale libres.",
    expectedResponse:
      "F-VD, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "Le délai de 2 minutes est écoulé. Vérification : piste libre, finale libre, CTM1230 parti. F-VD est déjà à H2 → clairance directe alignement + décollage, sans remontée.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 50, y: 50, label: 'CTM', heading: 315 },
      { id: 'F-VD', type: 'departure', x: 373, y: 158, label: 'F-VD', heading: 0 },
    ],
  },
  {
    id: 64,
    time: '09:29:00',
    speaker: { role: 'PILOTE', callsign: 'F-VD', color: 'departure' },
    message: 'F-VD, je quitte la fréquence, au revoir',
    expectedResponse: 'F-VD, roger, au revoir',
    teaching: "F-VD (C172) quitte la zone vers Grenoble. Strip archivé. Fréquence calme.",
    aircraft: [
      { id: 'F-VD', type: 'departure', x: 620, y: 50, label: 'F-VD', heading: 45 },
    ],
  },
  {
    id: 65,
    time: '09:31:00',
    speaker: { role: 'PILOTE', callsign: 'F-VR', color: 'arrival' },
    message:
      'AURIOL Tour, FGCVR, Beech 200, provenance CLERMONT-FERRAND via Chiroubles, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'FGCVR, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "Première communication — callsign complet (FGCVR). Chiroubles (Ouest) → intégration directe vent arrière main droite piste 27 (livret 3). Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 80, y: 95, label: 'F-VR', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 380, y: 245, label: 'F-QP', heading: 0 },
    ],
  },
  {
    id: 66,
    time: '09:32:00',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message:
      "AURIOL Tour, FBFQP, DR400, poste C2, destination TOURS via Nord-Ouest, demande roulage",
    expectedResponse:
      "FBFQP, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet (FBFQP). Poste C2, pas de conflit de roulage. Strip rouge (départ), route NW. Callsign abrégé : F-QP.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 150, y: 95, label: 'F-VR', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 380, y: 245, label: 'F-QP', heading: 0 },
    ],
  },
  {
    id: 67,
    time: '09:33:00',
    speaker: { role: 'PILOTE', callsign: 'F-VR', color: 'arrival' },
    message: 'F-VR, vent arrière main droite piste 27',
    expectedResponse: 'F-VR, numéro 1, rappelez finale',
    teaching:
      "F-VR seul dans le circuit. Numéro 1, rappel finale. F-QP est en roulage vers H2 — dès qu'il demandera la remontée, il faudra vérifier si F-VR a passé le travers tour (verrou).",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 300, y: 95, label: 'F-VR', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 373, y: 185, label: 'F-QP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 68,
    time: '09:34:00',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: "F-QP, prêt, demande remontée piste 27",
    expectedResponse:
      "F-QP, maintenez avant point d'attente piste 27, Beech 200 en fin de vent arrière",
    teaching:
      "Verrou de piste piste 27 pour une remontée (livret 3, §4) : F-VR a passé le travers tour en vent arrière → verrou actif. On maintient F-QP avec l'info trafic. La clairance de remontée ne peut pas être donnée tant que F-VR n'a pas atterri et dégagé.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 450, y: 95, label: 'F-VR', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 373, y: 158, label: 'F-QP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 69,
    time: '09:35:00',
    speaker: { role: 'PILOTE', callsign: 'F-VR', color: 'arrival' },
    message: 'F-VR, finale piste 27',
    expectedResponse:
      "F-VR, piste 27 autorisé atterrissage, vent 250°/10 kt — puis : F-QP, maintenez avant point d'attente piste 27, Beech 200 en finale, rappelez en vue",
    teaching:
      "Alignement conditionnel (livret 3, §5) — étape 1 : F-VR est en finale, F-QP est maintenu au PA. On donne la clairance atterrissage à F-VR, puis on demande à F-QP de rappeler quand il a visuellement identifié le Beech 200. La référence du conditionnel doit être un trafic que le pilote peut voir.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 605, y: 132, label: 'F-VR', heading: 270 },
      { id: 'F-QP', type: 'departure', x: 373, y: 158, label: 'F-QP', heading: 0 },
    ],
  },
  {
    id: 70,
    time: '09:35:30',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'F-QP, Beech 200 en vue',
    expectedResponse:
      "F-QP, derrière le Beech 200 en finale, remontez piste 27, alignez-vous et attendez derrière",
    teaching:
      "Alignement conditionnel (livret 3, §5) — étape 2 : le pilote a identifié visuellement l'arrivée. La clairance conditionnelle est donnée avec la référence explicite « derrière le [type] en [situation] ». F-QP entre sur la piste quand F-VR passe devant lui, remonte jusqu'au seuil 27, s'aligne et attend la clairance décollage de la tour.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 480, y: 132, label: 'F-VR', heading: 270 },
      { id: 'F-QP', type: 'departure', x: 373, y: 158, label: 'F-QP', heading: 0 },
    ],
  },

  // ── Séquence haute densité ──────────────────────────────────────────────────

  {
    id: 71,
    time: '09:36:00',
    speaker: { role: 'PILOTE', callsign: 'F-VR', color: 'arrival' },
    message: 'F-VR, piste dégagée, demande roulage',
    expectedResponse: 'F-VR, roulez poste A1',
    teaching: "F-VR (BE20) libère la piste. Poste A1 attribué. F-QP est aligné au seuil 27 — c'est la tour qui va initier sa clairance décollage.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 373, y: 165, label: 'F-VR', heading: 180 },
      { id: 'F-QP', type: 'departure', x: 615, y: 132, label: 'F-QP', heading: 270 },
    ],
  },
  {
    id: 72,
    time: '09:37:00',
    speaker: { role: 'INFO' },
    message:
      "F-QP (DR400) est aligné au seuil 27 depuis l'alignement conditionnel. F-VR vient de dégager la piste. Pas de trafic en approche. C'est à la tour d'initier la clairance décollage.",
    expectedResponse: "F-QP, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "Après un alignement conditionnel, la tour initie le décollage dès que la piste est libre — même logique que pour le « line up and wait ».",
    aircraft: [
      { id: 'F-QP', type: 'departure', x: 615, y: 132, label: 'F-QP', heading: 270 },
    ],
  },
  {
    id: 73,
    time: '09:38:00',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message:
      "AURIOL Tour, FBCGE, Cessna 172, provenance RENNES via Julienas, aérodrome estimé dans 5 minutes, pour atterrissage",
    expectedResponse:
      "FBCGE, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, trafic au départ vers vent arrière, DR400, rappelez vent arrière",
    teaching:
      "Première communication — callsign complet FBCGE. Julienas (Nord) → vent arrière main droite direct. F-QP (DR400) vient de décoller vers Tours/NW — trajectoires croisées au NW avec F-GE → info trafic.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 120, y: 30, label: 'F-GE', heading: 135 },
      { id: 'F-QP', type: 'departure', x: 310, y: 130, label: 'F-QP', heading: 270 },
    ],
  },
  {
    id: 74,
    time: '09:38:30',
    speaker: { role: 'PILOTE', callsign: 'F-NP', color: 'departure' },
    message:
      "AURIOL Tour, FGANP, Piper Cherokee, poste A3, destination PARIS via Saint-Amour, demande roulage",
    expectedResponse:
      "FGANP, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet FGANP. Poste A3, pas de conflit de roulage. Strip rouge, route Saint-Amour (NW). Callsign abrégé : F-NP.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 175, y: 60, label: 'F-GE', heading: 135 },
      { id: 'F-NP', type: 'departure', x: 335, y: 245, label: 'F-NP', heading: 0 },
      { id: 'F-QP', type: 'departure', x: 80, y: 110, label: 'F-QP', heading: 315 },
    ],
  },
  {
    id: 75,
    time: '09:39:00',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message:
      "AURIOL Tour, CTM4321, Transall, provenance ORLÉANS via Morgon, aérodrome estimé dans 5 minutes, pour un toucher piste 27, retour ORLÉANS via Saint-Amour",
    expectedResponse:
      "CTM4321, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, rappelez vertical tour",
    teaching:
      "CTM4321 (C160 Transall). Morgon (Sud) → vertical tour obligatoire. Strip rouge+bleu (TdP). Troisième avion simultané en fréquence — la densité monte.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 390, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 205, y: 85, label: 'F-GE', heading: 90 },
      { id: 'F-NP', type: 'departure', x: 335, y: 210, label: 'F-NP', heading: 0 },
    ],
  },
  {
    id: 76,
    time: '09:39:30',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message:
      "AURIOL Tour, FBXQR, Cessna 172, provenance RODEZ via le Sud-Ouest, aérodrome estimé dans 8 minutes, pour atterrissage",
    expectedResponse:
      "FBXQR, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, trafic du Sud vers vertical, Transall, rappelez vertical tour — puis : CTM4321, trafic du Sud-Ouest vers vertical, Cessna 172",
    teaching:
      "F-QR du SW → vertical tour obligatoire. CTM4321 monte depuis Morgon (S) vers le vertical : deux avions convergent vers le vertical depuis des directions différentes → info trafic réciproque (même situation que F-YH/G-ML à l'étape 28).",
    aircraft: [
      { id: 'F-QR', type: 'arrival', x: 60, y: 360, label: 'F-QR', heading: 45 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 345, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 225, y: 92, label: 'F-GE', heading: 90 },
      { id: 'F-NP', type: 'departure', x: 373, y: 185, label: 'F-NP', heading: 0 },
    ],
  },
  {
    id: 77,
    time: '09:40:00',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'F-QP, je quitte la fréquence, au revoir',
    expectedResponse: 'F-QP, roger, au revoir',
    teaching:
      "F-QP (DR400) quitte la zone vers Tours. Strip archivé. Quatre avions toujours en fréquence : F-GE, F-NP, CTM4321, F-QR.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 300, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 250, y: 95, label: 'F-GE', heading: 90 },
      { id: 'F-QR', type: 'arrival', x: 115, y: 320, label: 'F-QR', heading: 45 },
      { id: 'F-NP', type: 'departure', x: 373, y: 158, label: 'F-NP', heading: 0 },
    ],
  },
  {
    id: 78,
    time: '09:40:30',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message: 'F-GE, vent arrière main droite piste 27',
    expectedResponse: 'F-GE, numéro 1, rappelez finale',
    teaching:
      "F-GE seule en circuit (CTM4321 non encore en vent arrière). Numéro 1. F-NP est au point d'attente H2.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 275, y: 95, label: 'F-GE', heading: 90 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 260, label: 'CTM', heading: 0 },
      { id: 'F-QR', type: 'arrival', x: 165, y: 280, label: 'F-QR', heading: 45 },
      { id: 'F-NP', type: 'departure', x: 373, y: 158, label: 'F-NP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 79,
    time: '09:41:00',
    speaker: { role: 'INFO' },
    message:
      "F-NP (PA28) est au point d'attente H2, prêt pour un départ de l'intersection. F-GE (C172 de Julienas) est en vent arrière. Leurs trajectoires se croisent au NW — F-NP part vers Saint-Amour, F-GE arrive de Julienas. C'est à la tour d'initier la clairance décollage.",
    expectedResponse:
      "F-NP, trafic de Julienas vers vent arrière, Cessna 172, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27 — puis : F-GE, trafic au départ vers Saint-Amour, Piper Cherokee",
    teaching:
      "Départ intersection H2 + info trafic réciproque F-NP/F-GE (même schéma étapes 14, 48, 79). La tour initie dès que la piste est libre et le trafic le permet.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 365, y: 95, label: 'F-GE', heading: 90 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 225, label: 'CTM', heading: 0 },
      { id: 'F-QR', type: 'arrival', x: 210, y: 245, label: 'F-QR', heading: 45 },
      { id: 'F-NP', type: 'departure', x: 373, y: 132, label: 'F-NP', heading: 270 },
    ],
    showPattern: true,
  },
  {
    id: 80,
    time: '09:41:30',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, vertical tour',
    expectedResponse:
      "CTM4321, trafic de Julienas vers vent arrière, Cessna 172, rappelez vent arrière — puis : F-GE, trafic de vertical tour vers vent arrière, Transall",
    teaching:
      "CTM4321 au vertical. F-GE est en vent arrière → trajectoires croisées dans le NW (livret 4, p.16). Info trafic réciproque. F-NP est en montée initiale, F-QR toujours en route vers le vertical.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 262, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 435, y: 95, label: 'F-GE', heading: 90 },
      { id: 'F-NP', type: 'departure', x: 490, y: 130, label: 'F-NP', heading: 270 },
      { id: 'F-QR', type: 'arrival', x: 255, y: 215, label: 'F-QR', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 81,
    time: '09:42:00',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message: 'F-GE, finale piste 27',
    expectedResponse: 'F-GE, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-GE n°1 en finale. CTM4321 encore entre vertical et vent arrière. F-NP en montée. Piste libre — clairance atterrissage.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 605, y: 132, label: 'F-GE', heading: 270 },
      { id: 'CTM4321', type: 'circuit', x: 335, y: 185, label: 'CTM', heading: 0 },
      { id: 'F-NP', type: 'departure', x: 80, y: 105, label: 'F-NP', heading: 315 },
      { id: 'F-QR', type: 'arrival', x: 295, y: 180, label: 'F-QR', heading: 45 },
    ],
  },
  {
    id: 82,
    time: '09:43:00',
    speaker: { role: 'INFO' },
    message:
      "F-GE (C172, n°1) vient de toucher les roues — heure d'atterrissage notée. CTM4321 est entre le vertical et le vent arrière. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'CTM4321, numéro 1, rappelez finale',
    teaching:
      "Actualisation du numéro d'ordre au toucher des roues (livret 4, §8). CTM4321 n'avait pas encore de numéro — il devient automatiquement n°1. Transmission proactive, sans attendre son rappel vent arrière.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 225, y: 132, label: 'F-GE', heading: 270 },
      { id: 'CTM4321', type: 'circuit', x: 285, y: 145, label: 'CTM', heading: 0 },
      { id: 'F-QR', type: 'arrival', x: 330, y: 158, label: 'F-QR', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 83,
    time: '09:43:30',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message: 'F-QR, vertical tour',
    expectedResponse:
      "F-QR, trafic de Morgon vers vent arrière, Transall, rappelez vent arrière — puis : CTM4321, trafic de vertical tour vers vent arrière, Cessna 172",
    teaching:
      "F-QR passe le vertical (depuis SW). CTM4321 monte depuis Morgon (S) vers le vent arrière → trajectoires croisées au NW. Info trafic dans les deux sens.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 245, y: 115, label: 'CTM', heading: 0 },
      { id: 'F-QR', type: 'arrival', x: 370, y: 262, label: 'F-QR', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 373, y: 168, label: 'F-GE', heading: 180 },
    ],
  },
  {
    id: 84,
    time: '09:44:00',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, vent arrière main droite piste 27',
    expectedResponse: 'CTM4321, numéro 1, rappelez finale',
    teaching:
      "CTM4321 confirme vent arrière. Son numéro 1 avait été transmis à l'étape précédente (actualisation). On reconfirme : n°1, rappel finale.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 265, y: 95, label: 'CTM', heading: 90 },
      { id: 'F-QR', type: 'arrival', x: 335, y: 195, label: 'F-QR', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 85,
    time: '09:44:30',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message: 'F-QR, vent arrière main droite piste 27',
    expectedResponse: 'F-QR, numéro 2, suivez un Transall en vent arrière, rappelez finale',
    teaching:
      "F-QR entre en vent arrière. CTM4321 (n°1) est devant lui. Séquencement classique : n°2, suivre visuellement le Transall, rappel finale.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 385, y: 95, label: 'CTM', heading: 90 },
      { id: 'F-QR', type: 'arrival', x: 205, y: 95, label: 'F-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 86,
    time: '09:45:00',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, finale piste 27 pour un toucher',
    expectedResponse: 'CTM4321, piste 27 autorisé toucher, vent 250°/10 kt',
    teaching:
      "CTM4321 (Transall, cat. M) en finale pour un toucher. F-QR (n°2) est en vent arrière. Piste libre. Notez précisément l'heure du lever des roues au redécollage (hh:mm:ss).",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 605, y: 132, label: 'CTM', heading: 270 },
      { id: 'F-QR', type: 'arrival', x: 375, y: 95, label: 'F-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 87,
    time: '09:46:00',
    speaker: { role: 'INFO' },
    message:
      "CTM4321 (Transall C160, cat. M) vient de toucher et redécolle vers Saint-Amour (NW). Heure du lever des roues notée. F-QR (C172, cat. L, n°2) suit le Transall.",
    expectedResponse: 'F-QR, numéro 1, rappelez finale',
    teaching:
      "Actualisation n° au lever des roues du Transall. CTM4321 repart NW (Saint-Amour), F-QR atterrira cap W → trajectoires divergentes → pas de délai turbulence de sillage (même raisonnement que livret 5 §3 et étape 34-35 du scénario 1). F-QR devient n°1.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 130, y: 132, label: 'CTM', heading: 270 },
      { id: 'F-QR', type: 'arrival', x: 510, y: 95, label: 'F-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 88,
    time: '09:46:30',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message: 'F-QR, finale piste 27',
    expectedResponse: 'F-QR, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "CTM4321 est parti NW. Trajectoires divergentes confirmées — pas de délai. Piste libre. Clairance atterrissage pour F-QR (C172).",
    aircraft: [
      { id: 'F-QR', type: 'arrival', x: 605, y: 132, label: 'F-QR', heading: 270 },
      { id: 'CTM4321', type: 'circuit', x: 60, y: 65, label: 'CTM', heading: 315 },
    ],
  },
  {
    id: 89,
    time: '09:47:00',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message: 'F-QR, piste dégagée, demande roulage',
    expectedResponse: 'F-QR, roulez poste C2',
    teaching: "F-QR (C172) libère la piste. Poste C2 attribué. Piste disponible.",
    aircraft: [
      { id: 'F-QR', type: 'arrival', x: 373, y: 165, label: 'F-QR', heading: 180 },
    ],
  },
  {
    id: 90,
    time: '09:48:00',
    speaker: { role: 'PILOTE', callsign: 'F-KL', color: 'arrival' },
    message:
      "AURIOL Tour, FBVKL, TBM7, provenance GENÈVE via Penent, pour atterrissage, demande approche directe piste 27",
    expectedResponse: "FBVKL, exécutez approche directe piste 27, rappelez longue finale",
    teaching:
      "Approche directe (straight-in) depuis Penent (Est) — même situation que l'étape 2 du scénario 1 (FDVEN). Callsign complet FBVKL à la première communication. Rappel longue finale ; le numéro d'ordre sera donné à ce rappel.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 760, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-QR', type: 'arrival', x: 310, y: 210, label: 'F-QR', heading: 0 },
    ],
  },
  {
    id: 91,
    time: '09:48:30',
    speaker: { role: 'PILOTE', callsign: 'F-NP', color: 'departure' },
    message: 'F-NP, je quitte la fréquence, au revoir',
    expectedResponse: 'F-NP, roger, au revoir',
    teaching: "F-NP (PA28) quitte la zone vers Paris. Strip archivé.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 720, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-NP', type: 'departure', x: 50, y: 55, label: 'F-NP', heading: 315 },
    ],
  },
  {
    id: 92,
    time: '09:49:00',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message:
      "AURIOL Tour, FGCVS, Piper Cherokee, provenance CHAMBÉRY via Penent, pour atterrissage, demande approche semi-directe piste 27",
    expectedResponse: "FGCVS, entrez base main droite piste 27, rappelez base",
    teaching:
      "Approche semi-directe (livret 2, §4) : FGCVS arrive du NE et demande à entrer en base. Condition remplie — aucun avion dans le circuit (FBVKL est sur approche directe, pas encore en circuit). Le numéro d'ordre sera donné quand FGCVS rappellera 'base'. Strip bleu.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 690, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 620, y: 50, label: 'F-VS', heading: 225 },
    ],
  },
  {
    id: 93,
    time: '09:49:30',
    speaker: { role: 'PILOTE', callsign: 'F-HT', color: 'transit' },
    message:
      "AURIOL Tower, FBHQT, Cessna 172, transit from DIJON to NICE, 2500 ft QNH, over airfield estimated in 4 minutes, exit via Fleurie",
    expectedResponse: "FBHQT, runway 27 in use, QNH 1020, report overhead airfield",
    teaching:
      "Transit VFR : piste en service + QNH uniquement (pas de vent). Altitude 2500ft >> 1400ft circuit → aucun conflit d'altitude possible. Strip sans couleur (transit). Pilote anglophone → réponse en anglais.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 655, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 575, y: 80, label: 'F-VS', heading: 225 },
      { id: 'F-HT', type: 'transit', x: 640, y: 85, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 94,
    time: '09:50:00',
    speaker: { role: 'PILOTE', callsign: 'F-KL', color: 'arrival' },
    message: 'F-KL, longue finale piste 27',
    expectedResponse: 'F-KL, numéro 1, rappelez finale',
    teaching:
      "Approche directe : le numéro d'ordre est transmis en longue finale (livret 2, §5). F-VS est en route vers la base mais pas encore 'en base' — FBVKL est n°1. Rappel finale pour la clairance d'atterrissage.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 700, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 100, label: 'F-VS', heading: 225 },
      { id: 'F-HT', type: 'transit', x: 540, y: 155, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 95,
    time: '09:50:30',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message: 'F-VS, base main droite piste 27',
    expectedResponse: 'F-VS, numéro 2, suivez un TBM7 en finale, rappelez finale',
    teaching:
      "Numéro d'ordre transmis en base pour la semi-directe (livret 2, §4). FBVKL (TBM7) est en longue finale → F-VS est n°2. Séquencement : suivez le TBM7 visuellement, rappel finale.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 640, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 115, label: 'F-VS', heading: 180 },
      { id: 'F-HT', type: 'transit', x: 460, y: 215, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 96,
    time: '09:51:00',
    speaker: { role: 'PILOTE', callsign: 'F-HT', color: 'transit' },
    message: 'F-HT, overhead airfield',
    expectedResponse: 'F-HT, report Fleurie',
    teaching:
      "Transit au vertical aérodrome (2500ft). On donne le point de sortie : Fleurie (SE), direction Nice. Le transit ne crée aucun conflit avec le circuit (altitudes différentes).",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 605, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-HT', type: 'transit', x: 370, y: 260, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 97,
    time: '09:51:30',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'departure' },
    message:
      "AURIOL Tour, FBAMR, DR400, poste B2, destination MARSEILLE via Fleurie, demande roulage",
    expectedResponse:
      "FBAMR, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet FBAMR. Poste B2, pas de conflit. Destination Marseille via Fleurie (SE). Callsign abrégé : F-MR.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 575, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 118, label: 'F-VS', heading: 200 },
      { id: 'F-MR', type: 'departure', x: 350, y: 245, label: 'F-MR', heading: 0 },
      { id: 'F-HT', type: 'transit', x: 430, y: 330, label: 'F-HT', heading: 170 },
    ],
  },
  {
    id: 98,
    time: '09:52:00',
    speaker: { role: 'PILOTE', callsign: 'F-KL', color: 'arrival' },
    message: 'F-KL, finale piste 27',
    expectedResponse: 'F-KL, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-VS est en base/virage finale (n°2). Piste libre. Clairance atterrissage pour F-KL (TBM7). Notez l'heure d'atterrissage — F-VS sera actualisée n°1 au toucher.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 605, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-MR', type: 'departure', x: 373, y: 185, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 99,
    time: '09:52:30',
    speaker: { role: 'INFO' },
    message:
      "FBVKL (TBM7, n°1) vient de toucher les roues — heure notée. F-VS (PA28, n°2) est en courte finale. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'F-VS, numéro 1, rappelez finale',
    teaching:
      "Actualisation du numéro d'ordre au toucher des roues (livret 4, §8). F-VS était n°2 — elle devient automatiquement n°1. La piste est occupée par FBVKL qui roule : si F-VS est en courte finale, vérifier avant de donner la clairance d'atterrissage.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 280, y: 132, label: 'F-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 605, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-MR', type: 'departure', x: 373, y: 165, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 100,
    time: '09:53:00',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message: 'F-VS, finale piste 27',
    expectedResponse: 'F-VS, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "FBVKL a dégagé via H2. Piste libre. Clairance atterrissage pour F-VS (PA28).",
    aircraft: [
      { id: 'F-VS', type: 'arrival', x: 605, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-KL', type: 'arrival', x: 373, y: 165, label: 'F-KL', heading: 180 },
      { id: 'F-MR', type: 'departure', x: 373, y: 158, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 101,
    time: '09:53:30',
    speaker: { role: 'PILOTE', callsign: 'F-HT', color: 'transit' },
    message: 'F-HT, Fleurie, leaving frequency',
    expectedResponse: 'F-HT, roger, goodbye',
    teaching:
      "F-HT (transit) passe Fleurie et quitte la fréquence vers Nice. Strip archivé avec heure de dernier contact.",
    aircraft: [
      { id: 'F-VS', type: 'arrival', x: 310, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-HT', type: 'transit', x: 510, y: 375, label: 'F-HT', heading: 170 },
      { id: 'F-MR', type: 'departure', x: 373, y: 158, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 102,
    time: '09:54:00',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'departure' },
    message: "F-MR, prêt, demande départ de l'intersection",
    expectedResponse: "F-MR, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "F-MR (DR400) au point d'attente H2, pas de trafic en approche ni en circuit. Départ depuis l'intersection (TORA 500m). Clairance directe.",
    aircraft: [
      { id: 'F-MR', type: 'departure', x: 373, y: 158, label: 'F-MR', heading: 0 },
      { id: 'F-VS', type: 'arrival', x: 373, y: 165, label: 'F-VS', heading: 180 },
    ],
  },
  {
    id: 103,
    time: '09:54:30',
    speaker: { role: 'PILOTE', callsign: 'F-QR', color: 'arrival' },
    message: 'F-QR, je quitte la fréquence, au revoir',
    expectedResponse: 'F-QR, roger, au revoir',
    teaching:
      "F-QR (C172) quitte la fréquence depuis le parking C2. Strip archivé. F-MR (DR400) vient de décoller vers Marseille.",
    aircraft: [
      { id: 'F-MR', type: 'departure', x: 200, y: 130, label: 'F-MR', heading: 270 },
      { id: 'F-QR', type: 'arrival', x: 350, y: 245, label: 'F-QR', heading: 0 },
    ],
  },
  {
    id: 104,
    time: '09:55:00',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message: 'F-VS, je quitte la fréquence, au revoir',
    expectedResponse: 'F-VS, roger, au revoir',
    teaching: "F-VS (PA28) au parking. Strip archivé.",
    aircraft: [
      { id: 'F-VS', type: 'arrival', x: 310, y: 245, label: 'F-VS', heading: 0 },
      { id: 'F-MR', type: 'departure', x: 80, y: 115, label: 'F-MR', heading: 135 },
    ],
  },
  {
    id: 105,
    time: '09:55:30',
    speaker: { role: 'PILOTE', callsign: 'F-KL', color: 'arrival' },
    message: 'F-KL, je quitte la fréquence, au revoir',
    expectedResponse: 'F-KL, roger, au revoir',
    teaching: "F-KL (TBM7) au parking. Strip archivé.",
    aircraft: [
      { id: 'F-KL', type: 'arrival', x: 360, y: 245, label: 'F-KL', heading: 0 },
    ],
  },
  {
    id: 106,
    time: '09:56:00',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'departure' },
    message: 'F-MR, je quitte la fréquence, au revoir',
    expectedResponse: 'F-MR, roger, au revoir',
    teaching: "F-MR (DR400) quitte la zone vers Marseille. Strip archivé. Fréquence libre.",
    aircraft: [
      { id: 'F-MR', type: 'departure', x: 560, y: 220, label: 'F-MR', heading: 135 },
    ],
  },
  {
    id: 107,
    time: '09:57:00',
    speaker: { role: 'PILOTE', callsign: 'F-HR', color: 'arrival' },
    message:
      "AURIOL Tour, FBCHR, Cessna 172, provenance CLERMONT-FERRAND via Chiroubles, aérodrome estimé dans 5 minutes, pour atterrissage",
    expectedResponse:
      "FBCHR, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, rappelez vent arrière",
    teaching:
      "Première communication — callsign complet FBCHR. Chiroubles (Ouest) → vent arrière main droite direct (livret 3). Strip bleu.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 75, y: 95, label: 'F-HR', heading: 90 },
    ],
  },
  {
    id: 108,
    time: '09:57:30',
    speaker: { role: 'INFO' },
    message:
      "La météo transmet de nouveaux paramètres : QNH 1018, QFE 1006. F-HR est en fréquence.",
    expectedResponse: "F-HR, nouveaux paramètres QNH 1018",
    teaching:
      "Changement de pressions (livret 1 & 2) : 1. Collationner les valeurs auprès de la météo, 2. Modifier l'affichage, 3. Transmettre à chaque aéronef ou véhicule en fréquence. Le QFE n'est transmis que sur demande du pilote.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 155, y: 95, label: 'F-HR', heading: 90 },
    ],
  },
  {
    id: 109,
    time: '09:58:00',
    speaker: { role: 'PILOTE', callsign: 'F-HR', color: 'arrival' },
    message: 'F-HR, vent arrière main droite piste 27',
    expectedResponse: 'F-HR, numéro 1, rappelez finale',
    teaching: "F-HR seule en circuit. Numéro 1, rappel finale. QNH 1018 en vigueur.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 270, y: 95, label: 'F-HR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 110,
    time: '09:58:30',
    speaker: { role: 'PILOTE', callsign: 'F-GR', color: 'departure' },
    message:
      "AURIOL Tour, FBXGR, DR400, poste A4, destination TOURS via Saint-Amour, demande roulage",
    expectedResponse:
      "FBXGR, piste 27 en service, vent 250°/10 kt, QNH 1018, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet FBXGR. QNH 1018 transmis (nouveau QNH en vigueur). Strip rouge, route Saint-Amour (NW). Callsign abrégé : F-GR.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 390, y: 95, label: 'F-HR', heading: 90 },
      { id: 'F-GR', type: 'departure', x: 295, y: 245, label: 'F-GR', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 111,
    time: '09:59:00',
    speaker: { role: 'PILOTE', callsign: 'F-HR', color: 'arrival' },
    message: 'F-HR, finale piste 27',
    expectedResponse: 'F-HR, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-HR n°1 en finale. F-GR est en roulage vers H2. Piste libre. Clairance atterrissage. F-GR sera maintenu au point d'attente si F-HR n'a pas encore dégagé quand il sera prêt.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 605, y: 132, label: 'F-HR', heading: 270 },
      { id: 'F-GR', type: 'departure', x: 373, y: 185, label: 'F-GR', heading: 0 },
    ],
  },
];

const SCENARIOS = [
  {
    id: 'scenario_1',
    title: 'Matinée chargée — 40 min',
    description:
      "Scénario long combinant approche directe, laissez-passer, backtrack, remise de gaz, tour de piste, transit et verrou de piste. Pilotes anglais et français.",
    color: '#8b5cf6',
    icon: 'layers',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_1_STEPS,
  },
  {
    id: 'scenario_2',
    title: 'Matinée chargée — Suite',
    description:
      "Suite directe du scénario 1. Situations variées inspirées des livrets BASIC TWR.",
    color: '#3b82f6',
    icon: 'layers',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_2_STEPS,
  },
];

function AirportMap({ aircraft = [], showPattern = false }) {
  return (
    <svg viewBox="0 0 800 420" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">

      {/* Rose des vents — cercle + lettre N + flèche nord */}
      <g>
        <circle cx="45" cy="40" r="18" fill="none" stroke="#475569" strokeWidth="0.5" />
        <text x="45" y="28" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="500">N</text>
        <line x1="45" y1="55" x2="45" y2="30" stroke="#cbd5e1" strokeWidth="1.2" />
      </g>

      {/* Tour de piste main droite piste 27 — rectangle en pointillés au nord de la piste (y=78→120).
          La flèche indique le sens de circulation en vent arrière : cap 090° (est → ouest vu du sol = droite sur la carte). */}
      {showPattern && (
        <g>
          <rect x="130" y="78" width="420" height="42" fill="none" stroke="#a78bfa" strokeWidth="0.7" strokeDasharray="5 4" />
          <text x="340" y="72" textAnchor="middle" fontSize="9" fill="#a78bfa">vent arrière main droite piste 27</text>
          {/* Flèche de sens : les avions volent vers l'est en vent arrière (cap 090°) */}
          <path d="M 220 101 L 280 101" stroke="#a78bfa" strokeWidth="0.8" fill="none" />
          <polygon points="278,98 286,101 278,104" fill="#a78bfa" />
        </g>
      )}

      {/* Piste 09/27 — rectangle gris, seuil 09 à l'ouest (x=80), seuil 27 à l'est (x=620).
          Les avions atterrissent cap 270° (vers l'ouest) sur piste 27, approche depuis l'est. */}
      <g>
        <rect x="80" y="120" width="540" height="22" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
        {/* Numéros de piste aux deux seuils */}
        <text x="70" y="135" textAnchor="end" fontSize="11" fill="#e2e8f0" fontWeight="600">09</text>
        <text x="630" y="135" textAnchor="start" fontSize="11" fill="#e2e8f0" fontWeight="600">27</text>
        {/* Marques de seuil côté 09 — 3 barres verticales */}
        {[92, 98, 104].map((x) => (
          <line key={'l' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
        ))}
        {/* Marques de seuil côté 27 — 3 barres verticales */}
        {[596, 602, 608].map((x) => (
          <line key={'r' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
        ))}
      </g>

      {/* Taxiway H2 — intersection au milieu de la piste (x≈383).
          Le rect représente la voie de liaison piste↔voie principale.
          La ligne rouge est le point d'attente piste 27 (arrêt avant d'entrer sur la piste).
          Largeur du rect alignée sur la ligne de point d'attente (x=374→392). */}
      <g>
        <rect x="365" y="142" width="16" height="38" fill="#334155" />
        <line x1="365" y1="148" x2="381" y2="148" stroke="#ef4444" strokeWidth="1.5" />
        <text x="387" y="158" textAnchor="start" fontSize="8" fill="#94a3b8">H2</text>
      </g>

      {/* Bretelle E1 — voie de sortie côté seuil 09 (extrémité ouest, x=107).
          Relie la piste à la voie de circulation principale. */}
      <g>
        <rect x="91" y="142" width="13" height="40" fill="#334155" />
        <text x="75" y="165" textAnchor="end" fontSize="8" fill="#94a3b8">E1</text>
      </g>

      {/* Voie de circulation principale — axe horizontal (y=178) reliant E1 (x=107) au point d'attente piste 27 (x=550) */}
      <rect x="100" y="178" width="422" height="4" fill="#334155" />

      {/* Raccordements voie de circulation → zones de stationnement et SSLIA */}
      <rect x="205" y="182" width="12" height="18" fill="#334155" /> {/* vers aéroclub D */}
      <rect x="365" y="182" width="16" height="18" fill="#334155" /> {/* vers parking principal */}
      <rect x="510" y="182" width="12" height="18" fill="#334155" /> {/* vers SSLIA — accès véhicules de secours */}

      {/* Parking principal — postes A, B, C au sud de la piste.
          Labels illustratifs : d'autres postes existent (A4, B2, C2, C3) mais ne sont pas tous tracés. */}
      <g>
        <rect x="280" y="200" width="180" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
        <text x="370" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Parking principal</text>
        <text x="300" y="238" textAnchor="middle" fontSize="8" fill="#64748b">A2</text>
        <text x="340" y="238" textAnchor="middle" fontSize="8" fill="#64748b">B1</text>
        <text x="380" y="238" textAnchor="middle" fontSize="8" fill="#64748b">C1</text>
      </g>

      {/* Parking aéroclub D — postes D1, D2. Non visible depuis la tour (bâtiment interposé). */}
      <g>
        <rect x="180" y="200" width="60" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
        <text x="210" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Aéroclub</text>
        <text x="210" y="236" textAnchor="middle" fontSize="8" fill="#64748b">D</text>
      </g>

      {/* SSLIA — service de sauvetage et lutte contre l'incendie.
          Les véhicules SÉCU en partent et traversent la piste via H2 pour atteindre le local technique. */}
      <g>
        <rect x="490" y="200" width="50" height="28" fill="#7c2d12" fillOpacity="0.35" stroke="#d97706" strokeWidth="0.5" rx="2" />
        <text x="515" y="218" textAnchor="middle" fontSize="8" fill="#fcd34d">SSLIA</text>
      </g>

      {/* Tour de contrôle — point de référence au sud de la piste */}
      <g>
        <circle cx="370" cy="265" r="4" fill="#475569" />
        <text x="382" y="269" textAnchor="start" fontSize="8" fill="#94a3b8">TWR</text>
      </g>

      {/* Local technique — bâtiment au nord de la piste.
          SÉCU y accède depuis le SSLIA en traversant la piste (autorisation de traversée requise). */}
      <g>
        <rect x="374" y="85" width="50" height="22" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="2" />
        <text x="399" y="100" textAnchor="middle" fontSize="8" fill="#94a3b8">Local tech.</text>
      </g>

      {/* Aéronefs et véhicules — triangle orienté selon le cap pour les avions, rectangle pour les véhicules.
          Le triangle pointe vers le haut (nord) quand heading=0, et pivote dans le sens horaire. */}
      {aircraft.map((ac) => (
        <g
          key={ac.id}
          style={{ transition: 'transform 1500ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          transform={'translate(' + ac.x + ', ' + ac.y + ')'}
        >
          {ac.type === 'vehicle' ? (
            /* Véhicule — petit rectangle (pas de cap) */
            <rect x="-7" y="-5" width="14" height="10" fill={COLORS.vehicle} stroke="#92400e" strokeWidth="0.5" rx="1" />
          ) : (
            /* Avion — triangle en forme de flèche, pivoté selon le cap */
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
                        Scénario {idx + 1}/{SCENARIOS.length}
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
  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      setUserResponse('');
      setRevealed(false);
    }
  };
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
  const speakerColor = (() => {
    if (!current.speaker.callsign || !current.aircraft) return COLORS[current.speaker.color];
    const ac = current.aircraft.find(a => a.id === current.speaker.callsign);
    return ac ? COLORS[ac.type] : COLORS[current.speaker.color];
  })();

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
                  <Plane className="w-5 h-5" style={{ color: speakerColor }} />
                )}
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: speakerColor }}
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
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-600 hover:text-slate-200 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Étape précédente
              </button>
            )}
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

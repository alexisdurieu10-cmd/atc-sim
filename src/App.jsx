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
  ShieldCheck,
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
    time: '08:43:45',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, au parking, pour quitter la fréquence',
    expectedResponse: 'F-EN, roger, au revoir',
    teaching:
      "F-EN est garé au parking aéroclub. On accuse réception sobrement. On note l'heure de dernier contact sur le strip puis on l'archive.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 350, y: 245, label: 'F-EN', heading: 0 },
      { id: 'G-NC', type: 'departure', x: 540, y: 132, label: 'G-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 373, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
    time: '08:45:45',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'SÉCURITÉ, local technique, pour quitter la fréquence',
    expectedResponse: 'SÉCURITÉ, roger, au revoir',
    teaching:
      "SÉCURITÉ a traversé la piste et rejoint le local technique. On accuse réception sobrement. Strip SÉCURITÉ archivé.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 55, y: 100, label: 'F-XN', heading: 0 },
      { id: 'F-VH', type: 'arrival', x: 125, y: 40, label: 'F-VH', heading: 135 },
      { id: 'SECU', type: 'vehicle', x: 373, y: 95, label: 'SÉCU' },
    ],
  },
  {
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
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
    id: 23,
    time: '08:48:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, finale piste 27',
    expectedResponse: 'F-XN, piste 27 autorisé toucher, vent 250°/10 kt',
    teaching:
      "F-XN (DR400, n°1) rappelle en finale pour son tour de piste. Piste libre. Clairance toucher accordée — F-XN effectuera un toucher-roulé-décollage.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 550, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 380, y: 100, label: 'F-VH', heading: 90 },
      { id: 'G-TZ', type: 'arrival', x: 170, y: 155, label: 'G-TZ', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 24,
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
    id: 25,
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
    id: 26,
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
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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
    id: 34,
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
    id: 35,
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
    id: 36,
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
    id: 37,
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
    id: 38,
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
    id: 39,
    time: '08:56:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, piste dégagée, demande roulage',
    expectedResponse: 'F-VH, roulez parking aéroclub',
    teaching:
      "F-VH libère la piste. On lui attribue le parking aéroclub. Note Livret 2 : le parking D n'est pas visible depuis la tour — si le pilote avait demandé lui-même « parking D », on n'aurait pas à lui désigner de poste spécifique.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 140, y: 180, label: 'F-VH', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 380, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 40,
    time: '08:56:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, au parking, pour quitter la fréquence',
    expectedResponse: 'F-VH, roger, au revoir',
    teaching:
      "F-VH est garé au parking aéroclub. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 350, y: 245, label: 'F-VH', heading: 0 },
      { id: 'F-EP', type: 'departure', x: 373, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 405, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 41,
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
    id: 42,
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
    id: 43,
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
    id: 44,
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
    id: 45,
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
  ...SCENARIO_1_STEPS.slice(0, 44),
  {
    ...SCENARIO_1_STEPS[44],
    teaching:
      "Piste libre, aucun trafic en approche. Quand le trafic le permet et qu'aucun conflit n'est prévisible, on peut combiner remontée + alignement + décollage en une seule clairance. F-EP (BE20) décolle vers Colmar via Nord-Est.",
  },
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
    time: '09:09:00',
    speaker: { role: 'PILOTE', callsign: 'G-HC', color: 'arrival' },
    message:
      'AURIOL Tower, GBXHC, Cessna 172, from RENNES via Julienas, airfield estimated in 8 minutes, for landing',
    expectedResponse:
      'GBXHC, runway 27 in use, wind 250°/10 kt, QNH 1020, join right hand downwind runway 27, report downwind',
    teaching:
      "Première communication — callsign complet (GBXHC). Julienas (Nord) → intégration directe en vent arrière main droite, sans vertical tour. Pilote anglophone → réponse en anglais. F-NI est aligné sur la piste en attente.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 100, y: 30, label: 'G-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 615, y: 132, label: 'F-NI', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 7,
    time: '09:10:00',
    speaker: { role: 'INFO' },
    message:
      "F-NI est aligné au seuil 27 en attente. Pas de trafic en finale. G-HC (C172 de Julienas) s'approche depuis le Nord-Ouest — sa trajectoire et celle de F-NI au départ vers Saint-Amour se croisent au NW. C'est à la tour d'initier la clairance décollage.",
    expectedResponse:
      "F-NI, trafic de Julienas vers vent arrière, Cessna 172, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27 — puis : G-HC, traffic departing towards Saint-Amour, DR400",
    teaching:
      "La tour initie après « alignez-vous, attendez ». Trajectoires croisées au NW entre F-NI (départ Saint-Amour) et G-HC (arrivée Julienas) → info trafic réciproque obligatoire. Même situation que l'étape 14 du scénario 1.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 130, y: 50, label: 'G-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 615, y: 132, label: 'F-NI', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 230, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 8,
    time: '09:12:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vertical tour',
    expectedResponse:
      'F-LN, trafic de Julienas vers vent arrière, Cessna 172, rappelez vent arrière — puis : G-HC, traffic from overhead tower entering downwind, Piper Cherokee',
    teaching:
      "FGDLN passe le vertical. G-HC (C172 de Julienas) converge vers le vent arrière depuis le NW → trajectoires croisées (livret 4, p.16). Info trafic dans les deux sens. Le numéro d'ordre de F-LN sera donné à son rappel vent arrière.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 185, y: 75, label: 'G-HC', heading: 135 },
      { id: 'F-NI', type: 'departure', x: 60, y: 100, label: 'F-NI', heading: 315 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 9,
    time: '09:13:00',
    speaker: { role: 'PILOTE', callsign: 'G-HC', color: 'arrival' },
    message: 'G-HC, right hand downwind runway 27',
    expectedResponse: 'G-HC, number 1, report final',
    teaching:
      "G-HC est seule en vent arrière — FGDLN n'a pas encore rappelé vent arrière. Numéro 1, rappel finale. FGDLN intègre le circuit dans quelques instants.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 310, y: 95, label: 'G-HC', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 330, y: 175, label: 'F-LN', heading: 0 },
      { id: 'F-NI', type: 'departure', x: 30, y: 70, label: 'F-NI', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 10,
    time: '09:13:30',
    speaker: { role: 'PILOTE', callsign: 'F-NI', color: 'departure' },
    message: 'F-NI, quittons la fréquence, au revoir',
    expectedResponse: 'F-NI, roger, au revoir',
    teaching:
      "F-NI (DR400) quitte la zone vers Lille. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-NI', type: 'departure', x: 10, y: 40, label: 'F-NI', heading: 315 },
      { id: 'G-HC', type: 'arrival', x: 395, y: 95, label: 'G-HC', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 290, y: 145, label: 'F-LN', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 11,
    time: '09:14:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vent arrière main droite piste 27',
    expectedResponse: 'F-LN, numéro 2, suivez un Cessna 172 en finale, rappelez finale',
    teaching:
      "F-LN intègre le vent arrière. G-HC (n°1) est déjà en finale devant lui. Séquencement : numéro 2, suivre le C172 visuellement, rappel finale.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 605, y: 132, label: 'G-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 230, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 12,
    time: '09:15:00',
    speaker: { role: 'PILOTE', callsign: 'G-HC', color: 'arrival' },
    message: 'G-HC, final runway 27',
    expectedResponse: 'G-HC, runway 27 cleared to land, wind 250°/10 kt',
    teaching:
      "F-LN est en vent arrière (n°2). Piste libre. Atterrissage autorisé pour G-HC.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 570, y: 132, label: 'G-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 395, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 13,
    time: '09:16:00',
    speaker: { role: 'INFO' },
    message:
      "G-HC (C172) vient de toucher les roues — heure d'atterrissage notée. F-LN (PA28) est en vent arrière et était numéro 2. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'F-LN, numéro 1, rappelez finale',
    teaching:
      "L'avion n°1 perd son numéro au toucher des roues. Le contrôleur actualise immédiatement, sans attendre le prochain rappel de F-LN (livret 4, section 8). F-LN devient n°1 dès le toucher de G-HC.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 400, y: 132, label: 'G-HC', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 480, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 14,
    time: '09:17:00',
    speaker: { role: 'PILOTE', callsign: 'F-TP', color: 'departure' },
    message:
      'AURIOL Tour, FGCTP, Tobago, poste C1, destination SAINT-ETIENNE via le Sud-Ouest, demande roulage',
    expectedResponse:
      "FGCTP, piste 27 en service, vent 250°/10 kt, QNH 1020, laissez passer le Cessna 172 de la piste vers le parking, puis roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet (FGCTP). Conflit de roulage : G-HC dégage la piste via H2 et emprunte le même taxiway que FGCTP doit utiliser (C1 → H2). On laisse passer l'arrivée, puis on autorise le roulage (livret 4, section 9).",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 430, y: 175, label: 'G-HC', heading: 90 },
      { id: 'F-TP', type: 'departure', x: 405, y: 245, label: 'F-TP', heading: 0 },
      { id: 'F-LN', type: 'arrival', x: 545, y: 95, label: 'F-LN', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 15,
    time: '09:18:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, finale piste 27',
    expectedResponse: 'F-LN, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "G-HC a dégagé, piste libre. F-LN (PA28) autorisé à atterrir. F-TP attend au parking — il pourra rouler dès que G-HC sera complètement dégagée du taxiway.",
    aircraft: [
      { id: 'F-LN', type: 'arrival', x: 605, y: 132, label: 'F-LN', heading: 270 },
      { id: 'F-TP', type: 'departure', x: 405, y: 245, label: 'F-TP', heading: 0 },
      { id: 'G-HC', type: 'arrival', x: 340, y: 245, label: 'G-HC', heading: 0 },
    ],
  },
  {
    id: 16,
    time: '09:18:30',
    speaker: { role: 'PILOTE', callsign: 'G-HC', color: 'arrival' },
    message: 'G-HC, at the stand, leaving frequency, goodbye',
    expectedResponse: 'G-HC, roger, goodbye',
    teaching:
      "G-HC (C172) est garé au parking principal. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'G-HC', type: 'arrival', x: 340, y: 245, label: 'G-HC', heading: 0 },
      { id: 'F-LN', type: 'arrival', x: 450, y: 132, label: 'F-LN', heading: 270 },
      { id: 'F-TP', type: 'departure', x: 405, y: 245, label: 'F-TP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 17,
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
    id: 18,
    time: '09:19:30',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, au parking, pour quitter la fréquence',
    expectedResponse: 'F-LN, roger, au revoir',
    teaching:
      "F-LN (PA28) est garé au poste B1. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-LN', type: 'arrival', x: 330, y: 245, label: 'F-LN', heading: 0 },
      { id: 'F-TP', type: 'departure', x: 373, y: 185, label: 'F-TP', heading: 0 },
    ],
  },
  {
    id: 19,
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
    id: 20,
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
    id: 21,
    time: '09:23:00',
    speaker: { role: 'PILOTE', callsign: 'F-TP', color: 'departure' },
    message: 'F-TP, quittons la fréquence, au revoir',
    expectedResponse: 'F-TP, roger, au revoir',
    teaching:
      "F-TP (TB10) quitte la zone vers Saint-Etienne. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 170, y: 35, label: 'CTM', heading: 135 },
      { id: 'F-TP', type: 'departure', x: 100, y: 300, label: 'F-TP', heading: 200 },
    ],
  },
  {
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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
    id: 26,
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
    id: 27,
    time: '09:28:30',
    speaker: { role: 'PILOTE', callsign: 'CTM1230', color: 'circuit' },
    message: 'CTM1230, quittons la fréquence, au revoir',
    expectedResponse: 'CTM1230, roger, au revoir',
    teaching:
      "CTM1230 (Transall C160) quitte la zone vers Orléans via Saint-Amour. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'CTM1230', type: 'circuit', x: 10, y: 25, label: 'CTM', heading: 315 },
      { id: 'F-VD', type: 'departure', x: 373, y: 158, label: 'F-VD', heading: 0 },
    ],
  },
  {
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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
    id: 34,
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
    id: 35,
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
    id: 36,
    time: '09:36:30',
    speaker: { role: 'PILOTE', callsign: 'F-VR', color: 'arrival' },
    message: 'F-VR, au parking, pour quitter la fréquence',
    expectedResponse: 'F-VR, roger, au revoir',
    teaching:
      "F-VR (BE20) est garé au poste A1. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-VR', type: 'arrival', x: 350, y: 245, label: 'F-VR', heading: 0 },
      { id: 'F-QP', type: 'departure', x: 615, y: 132, label: 'F-QP', heading: 270 },
    ],
  },
  {
    id: 37,
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
    id: 38,
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
    id: 39,
    time: '09:38:30',
    speaker: { role: 'PILOTE', callsign: 'G-NP', color: 'departure' },
    message:
      "AURIOL Tower, GBANP, Piper Cherokee, stand A3, to PARIS via Saint-Amour, request taxi",
    expectedResponse:
      "GBANP, runway 27 in use, wind 250°/10 kt, QNH 1020, taxi holding point runway 27",
    teaching:
      "Première communication — callsign complet GBANP. Stand A3, pas de conflit de roulage. Strip rouge, route Saint-Amour (NW). Pilote anglophone → réponse en anglais. Callsign abrégé : G-NP.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 175, y: 60, label: 'F-GE', heading: 135 },
      { id: 'G-NP', type: 'departure', x: 335, y: 245, label: 'G-NP', heading: 0 },
      { id: 'F-QP', type: 'departure', x: 80, y: 110, label: 'F-QP', heading: 315 },
    ],
  },
  {
    id: 40,
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
      { id: 'G-NP', type: 'departure', x: 335, y: 210, label: 'G-NP', heading: 0 },
    ],
  },
  {
    id: 41,
    time: '09:39:30',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message:
      "AURIOL Tower, GBXQR, Cessna 172, from RODEZ via South-West, airfield estimated in 8 minutes, for landing",
    expectedResponse:
      "GBXQR, runway 27 in use, wind 250°/10 kt, QNH 1020, join right hand downwind runway 27 via overhead tower, traffic from the South towards overhead, Transall, report overhead tower — puis : CTM4321, trafic du Sud-Ouest vers vertical, Cessna 172",
    teaching:
      "G-QR du SW → vertical tour obligatoire. CTM4321 monte depuis Morgon (S) vers le vertical : deux avions convergent vers le vertical depuis des directions différentes → info trafic réciproque (même situation que F-YH/G-ML à l'étape 28).",
    aircraft: [
      { id: 'G-QR', type: 'arrival', x: 60, y: 360, label: 'G-QR', heading: 45 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 345, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 225, y: 92, label: 'F-GE', heading: 90 },
      { id: 'G-NP', type: 'departure', x: 373, y: 185, label: 'G-NP', heading: 0 },
    ],
  },
  {
    id: 42,
    time: '09:40:00',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'F-QP, je quitte la fréquence, au revoir',
    expectedResponse: 'F-QP, roger, au revoir',
    teaching:
      "F-QP (DR400) quitte la zone vers Tours. Strip archivé. Quatre avions toujours en fréquence : F-GE, G-NP, CTM4321, G-QR.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 300, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 250, y: 95, label: 'F-GE', heading: 90 },
      { id: 'G-QR', type: 'arrival', x: 115, y: 320, label: 'G-QR', heading: 45 },
      { id: 'G-NP', type: 'departure', x: 373, y: 158, label: 'G-NP', heading: 0 },
    ],
  },
  {
    id: 43,
    time: '09:40:30',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message: 'F-GE, vent arrière main droite piste 27',
    expectedResponse: 'F-GE, numéro 1, rappelez finale',
    teaching:
      "F-GE seule en circuit (CTM4321 non encore en vent arrière). Numéro 1. G-NP est au point d'attente H2.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 275, y: 95, label: 'F-GE', heading: 90 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 260, label: 'CTM', heading: 0 },
      { id: 'G-QR', type: 'arrival', x: 165, y: 280, label: 'G-QR', heading: 45 },
      { id: 'G-NP', type: 'departure', x: 373, y: 158, label: 'G-NP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 44,
    time: '09:41:00',
    speaker: { role: 'INFO' },
    message:
      "G-NP (PA28) est au point d'attente H2, prêt pour un départ de l'intersection. F-GE (C172 de Julienas) est en vent arrière. Leurs trajectoires se croisent au NW — G-NP part vers Saint-Amour, F-GE arrive de Julienas. C'est à la tour d'initier la clairance décollage.",
    expectedResponse:
      "G-NP, traffic from Julienas entering downwind, Cessna 172, runway 27 cleared for takeoff, wind 250°/10 kt, report right hand downwind runway 27 — puis : F-GE, trafic au départ vers Saint-Amour, Piper Cherokee",
    teaching:
      "Départ intersection H2 + info trafic réciproque G-NP/F-GE (même schéma étapes 14, 48, 79). La tour initie dès que la piste est libre et le trafic le permet.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 365, y: 95, label: 'F-GE', heading: 90 },
      { id: 'CTM4321', type: 'circuit', x: 370, y: 225, label: 'CTM', heading: 0 },
      { id: 'G-QR', type: 'arrival', x: 210, y: 245, label: 'G-QR', heading: 45 },
      { id: 'G-NP', type: 'departure', x: 373, y: 132, label: 'G-NP', heading: 270 },
    ],
    showPattern: true,
  },
  {
    id: 45,
    time: '09:41:30',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, vertical tour',
    expectedResponse:
      "CTM4321, trafic de Julienas vers vent arrière, Cessna 172, rappelez vent arrière — puis : F-GE, trafic de vertical tour vers vent arrière, Transall",
    teaching:
      "CTM4321 au vertical. F-GE est en vent arrière → trajectoires croisées dans le NW (livret 4, p.16). Info trafic réciproque. G-NP est en montée initiale, G-QR toujours en route vers le vertical.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 262, label: 'CTM', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 435, y: 95, label: 'F-GE', heading: 90 },
      { id: 'G-NP', type: 'departure', x: 490, y: 130, label: 'G-NP', heading: 270 },
      { id: 'G-QR', type: 'arrival', x: 255, y: 215, label: 'G-QR', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 46,
    time: '09:42:00',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message: 'F-GE, finale piste 27',
    expectedResponse: 'F-GE, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-GE n°1 en finale. CTM4321 encore entre vertical et vent arrière. G-NP en montée. Piste libre — clairance atterrissage.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 605, y: 132, label: 'F-GE', heading: 270 },
      { id: 'CTM4321', type: 'circuit', x: 335, y: 185, label: 'CTM', heading: 0 },
      { id: 'G-NP', type: 'departure', x: 80, y: 105, label: 'G-NP', heading: 315 },
      { id: 'G-QR', type: 'arrival', x: 295, y: 180, label: 'G-QR', heading: 45 },
    ],
  },
  {
    id: 47,
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
      { id: 'G-QR', type: 'arrival', x: 330, y: 158, label: 'G-QR', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 48,
    time: '09:43:30',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message: 'G-QR, overhead tower',
    expectedResponse:
      "G-QR, traffic from Morgon entering downwind, Transall, report downwind — puis : CTM4321, trafic de vertical tour vers vent arrière, Cessna 172",
    teaching:
      "G-QR passe le vertical (depuis SW). CTM4321 monte depuis Morgon (S) vers le vent arrière → trajectoires croisées au NW. Info trafic dans les deux sens.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 370, y: 165, label: 'CTM', heading: 0 },
      { id: 'G-QR', type: 'arrival', x: 370, y: 262, label: 'G-QR', heading: 0 },
      { id: 'F-GE', type: 'arrival', x: 373, y: 168, label: 'F-GE', heading: 180 },
    ],
  },
  {
    id: 49,
    time: '09:44:00',
    speaker: { role: 'PILOTE', callsign: 'F-GE', color: 'arrival' },
    message: 'F-GE, au parking, pour quitter la fréquence',
    expectedResponse: 'F-GE, roger, au revoir',
    teaching:
      "F-GE (C172) est garée au parking. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-GE', type: 'arrival', x: 310, y: 245, label: 'F-GE', heading: 0 },
      { id: 'CTM4321', type: 'circuit', x: 265, y: 95, label: 'CTM', heading: 90 },
      { id: 'G-QR', type: 'arrival', x: 295, y: 220, label: 'G-QR', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 50,
    time: '09:44:00',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, vent arrière main droite piste 27',
    expectedResponse: 'CTM4321, numéro 1, rappelez finale',
    teaching:
      "CTM4321 confirme vent arrière. Son numéro 1 avait été transmis à l'étape précédente (actualisation). On reconfirme : n°1, rappel finale.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 265, y: 95, label: 'CTM', heading: 90 },
      { id: 'G-QR', type: 'arrival', x: 335, y: 195, label: 'G-QR', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 51,
    time: '09:44:30',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message: 'G-QR, right hand downwind runway 27',
    expectedResponse: 'G-QR, number 2, follow a Transall on downwind, report final',
    teaching:
      "G-QR entre en vent arrière. CTM4321 (n°1) est devant lui. Séquencement classique : n°2, suivre visuellement le Transall, rappel finale.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 385, y: 95, label: 'CTM', heading: 90 },
      { id: 'G-QR', type: 'arrival', x: 205, y: 95, label: 'G-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 52,
    time: '09:45:00',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, finale piste 27 pour un toucher',
    expectedResponse: 'CTM4321, piste 27 autorisé toucher, vent 250°/10 kt',
    teaching:
      "CTM4321 (Transall, cat. M) en finale pour un toucher. G-QR (n°2) est en vent arrière. Piste libre. Notez précisément l'heure du lever des roues au redécollage (hh:mm:ss).",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 605, y: 132, label: 'CTM', heading: 270 },
      { id: 'G-QR', type: 'arrival', x: 375, y: 95, label: 'G-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 53,
    time: '09:46:00',
    speaker: { role: 'INFO' },
    message:
      "CTM4321 (Transall C160, cat. M) vient de toucher et redécolle vers Saint-Amour (NW). Heure du lever des roues notée. G-QR (C172, cat. L, n°2) suit le Transall.",
    expectedResponse: 'G-QR, number 1, report final',
    teaching:
      "Actualisation n° au lever des roues du Transall. CTM4321 repart NW (Saint-Amour), G-QR atterrira cap W → trajectoires divergentes → pas de délai turbulence de sillage (même raisonnement que livret 5 §3 et étape 34-35 du scénario 1). G-QR devient n°1.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 130, y: 132, label: 'CTM', heading: 270 },
      { id: 'G-QR', type: 'arrival', x: 510, y: 95, label: 'G-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 54,
    time: '09:46:30',
    speaker: { role: 'PILOTE', callsign: 'CTM4321', color: 'circuit' },
    message: 'CTM4321, quittons la fréquence, au revoir',
    expectedResponse: 'CTM4321, roger, au revoir',
    teaching:
      "CTM4321 (Transall C160) quitte la zone vers Orléans via Saint-Amour. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'CTM4321', type: 'circuit', x: 30, y: 70, label: 'CTM', heading: 315 },
      { id: 'G-QR', type: 'arrival', x: 560, y: 95, label: 'G-QR', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 55,
    time: '09:46:30',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message: 'G-QR, final runway 27',
    expectedResponse: 'G-QR, runway 27 cleared to land, wind 250°/10 kt',
    teaching:
      "CTM4321 est parti NW. Trajectoires divergentes confirmées — pas de délai. Piste libre. Clairance atterrissage pour G-QR (C172).",
    aircraft: [
      { id: 'G-QR', type: 'arrival', x: 605, y: 132, label: 'G-QR', heading: 270 },
      { id: 'CTM4321', type: 'circuit', x: 60, y: 65, label: 'CTM', heading: 315 },
    ],
  },
  {
    id: 56,
    time: '09:47:00',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message: 'G-QR, clear of runway, request taxi',
    expectedResponse: 'G-QR, taxi stand C2',
    teaching: "G-QR (C172) libère la piste. Poste C2 attribué. Piste disponible.",
    aircraft: [
      { id: 'G-QR', type: 'arrival', x: 373, y: 165, label: 'G-QR', heading: 180 },
    ],
  },
  {
    id: 57,
    time: '09:48:00',
    speaker: { role: 'PILOTE', callsign: 'G-KL', color: 'arrival' },
    message:
      "AURIOL Tower, GBVKL, TBM7, from GENEVA via Penent, for landing, request straight-in approach runway 27",
    expectedResponse: "GBVKL, straight-in approach runway 27, report long final",
    teaching:
      "Approche directe (straight-in) depuis Penent (Est) — même situation que l'étape 2 du scénario 1 (FDVEN). Callsign complet GBVKL à la première communication. Pilote anglophone → réponse en anglais. Rappel longue finale ; le numéro d'ordre sera donné à ce rappel.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 760, y: 132, label: 'G-KL', heading: 270 },
      { id: 'G-QR', type: 'arrival', x: 310, y: 210, label: 'G-QR', heading: 0 },
    ],
  },
  {
    id: 58,
    time: '09:48:30',
    speaker: { role: 'PILOTE', callsign: 'G-NP', color: 'departure' },
    message: 'G-NP, leaving frequency, goodbye',
    expectedResponse: 'G-NP, roger, goodbye',
    teaching: "G-NP (PA28) quitte la zone vers Paris. Strip archivé.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 720, y: 132, label: 'G-KL', heading: 270 },
      { id: 'G-NP', type: 'departure', x: 50, y: 55, label: 'G-NP', heading: 315 },
    ],
  },
  {
    id: 59,
    time: '09:49:00',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message:
      "AURIOL Tour, FGCVS, Piper Cherokee, provenance CHAMBÉRY via Penent, pour atterrissage, demande approche semi-directe piste 27",
    expectedResponse: "FGCVS, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez base main droite piste 27, rappelez base",
    teaching:
      "Approche semi-directe (livret 2, §4) : FGCVS arrive du NE et demande à entrer en base. Premier contact → piste + vent + QNH transmis. Condition remplie — aucun avion dans le circuit (GBVKL est sur approche directe, pas encore en circuit). Le numéro d'ordre sera donné quand FGCVS rappellera 'base'. Strip bleu.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 690, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 620, y: 50, label: 'F-VS', heading: 225 },
    ],
  },
  {
    id: 60,
    time: '09:49:30',
    speaker: { role: 'PILOTE', callsign: 'F-HT', color: 'transit' },
    message:
      "AURIOL Tower, FBHQT, Cessna 172, transit from DIJON to NICE, 2500 ft QNH, over airfield estimated in 4 minutes, exit via Fleurie",
    expectedResponse: "FBHQT, runway 27 in use, QNH 1020, report overhead airfield",
    teaching:
      "Transit VFR : piste en service + QNH uniquement (pas de vent). Altitude 2500ft >> 1400ft circuit → aucun conflit d'altitude possible. Strip sans couleur (transit). Pilote anglophone → réponse en anglais.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 655, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 575, y: 80, label: 'F-VS', heading: 225 },
      { id: 'F-HT', type: 'transit', x: 640, y: 85, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 61,
    time: '09:50:00',
    speaker: { role: 'PILOTE', callsign: 'G-KL', color: 'arrival' },
    message: 'G-KL, long final runway 27',
    expectedResponse: 'G-KL, number 1, report final',
    teaching:
      "Approche directe : le numéro d'ordre est transmis en longue finale (livret 2, §5). F-VS est en route vers la base mais pas encore 'en base' — GBVKL est n°1. Rappel finale pour la clairance d'atterrissage.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 625, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 100, label: 'F-VS', heading: 225 },
      { id: 'F-HT', type: 'transit', x: 540, y: 155, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 62,
    time: '09:50:30',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message: 'F-VS, base main droite piste 27',
    expectedResponse: 'F-VS, numéro 2, suivez un TBM7 en finale, rappelez finale',
    teaching:
      "Numéro d'ordre transmis en base pour la semi-directe (livret 2, §4). GBVKL (TBM7) est en longue finale → F-VS est n°2. Séquencement : suivez le TBM7 visuellement, rappel finale.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 640, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 115, label: 'F-VS', heading: 180 },
      { id: 'F-HT', type: 'transit', x: 460, y: 215, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 63,
    time: '09:51:00',
    speaker: { role: 'PILOTE', callsign: 'F-HT', color: 'transit' },
    message: 'F-HT, overhead airfield',
    expectedResponse: 'F-HT, report Fleurie',
    teaching:
      "Transit au vertical aérodrome (2500ft). On donne le point de sortie : Fleurie (SE), direction Nice. Le transit ne crée aucun conflit avec le circuit (altitudes différentes).",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 605, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 545, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-HT', type: 'transit', x: 370, y: 260, label: 'F-HT', heading: 200 },
    ],
  },
  {
    id: 64,
    time: '09:51:30',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'departure' },
    message:
      "AURIOL Tour, FBAMR, DR400, poste B2, destination MARSEILLE via Fleurie, demande roulage",
    expectedResponse:
      "FBAMR, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet FBAMR. Poste B2, pas de conflit. Destination Marseille via Fleurie (SE). Callsign abrégé : F-MR.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 575, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 510, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-MR', type: 'departure', x: 350, y: 245, label: 'F-MR', heading: 0 },
      { id: 'F-HT', type: 'transit', x: 430, y: 330, label: 'F-HT', heading: 170 },
    ],
  },
  {
    id: 65,
    time: '09:52:00',
    speaker: { role: 'PILOTE', callsign: 'G-KL', color: 'arrival' },
    message: 'G-KL, final runway 27',
    expectedResponse: 'G-KL, runway 27 cleared to land, wind 250°/10 kt',
    teaching:
      "F-VS est en base/virage finale (n°2). Piste libre. Clairance atterrissage pour G-KL (TBM7). Notez l'heure d'atterrissage — F-VS sera actualisée n°1 au toucher.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 545, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 510, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-MR', type: 'departure', x: 373, y: 185, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 66,
    time: '09:52:30',
    speaker: { role: 'INFO' },
    message:
      "GBVKL (TBM7, n°1) vient de toucher les roues — heure notée. F-VS (PA28, n°2) est en courte finale. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'F-VS, numéro 1, rappelez finale',
    teaching:
      "Actualisation du numéro d'ordre au toucher des roues (livret 4, §8). F-VS était n°2 — elle devient automatiquement n°1. La piste est occupée par GBVKL qui roule : si F-VS est en courte finale, vérifier avant de donner la clairance d'atterrissage.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 280, y: 132, label: 'G-KL', heading: 270 },
      { id: 'F-VS', type: 'arrival', x: 605, y: 132, label: 'F-VS', heading: 270 },
      { id: 'F-MR', type: 'departure', x: 373, y: 165, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 67,
    time: '09:53:00',
    speaker: { role: 'PILOTE', callsign: 'F-VS', color: 'arrival' },
    message: 'F-VS, finale piste 27',
    expectedResponse: 'F-VS, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "GBVKL a dégagé via H2. Piste libre. Clairance atterrissage pour F-VS (PA28).",
    aircraft: [
      { id: 'F-VS', type: 'arrival', x: 605, y: 132, label: 'F-VS', heading: 270 },
      { id: 'G-KL', type: 'arrival', x: 373, y: 165, label: 'G-KL', heading: 180 },
      { id: 'F-MR', type: 'departure', x: 373, y: 158, label: 'F-MR', heading: 0 },
    ],
  },
  {
    id: 68,
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
    id: 69,
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
    id: 70,
    time: '09:54:30',
    speaker: { role: 'PILOTE', callsign: 'G-QR', color: 'arrival' },
    message: 'G-QR, leaving frequency, goodbye',
    expectedResponse: 'G-QR, roger, goodbye',
    teaching:
      "G-QR (C172) quitte la fréquence depuis le parking C2. Strip archivé. F-MR (DR400) vient de décoller vers Marseille.",
    aircraft: [
      { id: 'F-MR', type: 'departure', x: 200, y: 130, label: 'F-MR', heading: 270 },
      { id: 'G-QR', type: 'arrival', x: 350, y: 245, label: 'G-QR', heading: 0 },
    ],
  },
  {
    id: 71,
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
    id: 72,
    time: '09:55:30',
    speaker: { role: 'PILOTE', callsign: 'G-KL', color: 'arrival' },
    message: 'G-KL, leaving frequency, goodbye',
    expectedResponse: 'G-KL, roger, goodbye',
    teaching: "G-KL (TBM7) au parking. Strip archivé.",
    aircraft: [
      { id: 'G-KL', type: 'arrival', x: 360, y: 245, label: 'G-KL', heading: 0 },
    ],
  },
  {
    id: 73,
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
    id: 74,
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
    id: 75,
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
    id: 76,
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
    id: 77,
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
    id: 78,
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
  {
    id: 79,
    time: '09:59:30',
    speaker: { role: 'PILOTE', callsign: 'F-HR', color: 'arrival' },
    message: 'F-HR, piste dégagée, demande roulage',
    expectedResponse: 'F-HR, roulez poste A3',
    teaching: "F-HR libère la piste. Poste A3 attribué. F-GR peut progresser vers H2.",
    aircraft: [
      { id: 'F-HR', type: 'arrival', x: 373, y: 165, label: 'F-HR', heading: 180 },
      { id: 'F-GR', type: 'departure', x: 373, y: 158, label: 'F-GR', heading: 0 },
    ],
  },
  {
    id: 80,
    time: '10:00:00',
    speaker: { role: 'PILOTE', callsign: 'F-KR', color: 'departure' },
    message:
      "AURIOL Tour, FBTKR, TBM7, poste C3, destination CAEN via Saint-Amour, demande roulage",
    expectedResponse:
      "FBTKR, piste 27 en service, vent 250°/10 kt, QNH 1018, roulez point d'attente piste 27",
    teaching:
      "Première communication — callsign complet FBTKR. Poste C3, pas de conflit de roulage. Strip rouge, route Saint-Amour (NW). Même sortie que FBXGR (F-GR) — à noter sur les strips.",
    aircraft: [
      { id: 'F-GR', type: 'departure', x: 373, y: 158, label: 'F-GR', heading: 0 },
      { id: 'F-KR', type: 'departure', x: 405, y: 245, label: 'F-KR', heading: 0 },
      { id: 'F-HR', type: 'arrival', x: 295, y: 205, label: 'F-HR', heading: 90 },
    ],
  },
  {
    id: 81,
    time: '10:01:00',
    speaker: { role: 'PILOTE', callsign: 'F-GR', color: 'departure' },
    message: "F-GR, prêt, demande départ de l'intersection",
    expectedResponse:
      "F-GR, trafic au départ vers vent arrière, TBM7 via Saint-Amour, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "Deux départs même sortie (livret 5, §4) : FBXGR (DR400) et FBTKR (TBM7) partent tous deux via Saint-Amour (NW). En comparant les strips, le contrôleur détecte la même sortie → info trafic obligatoire. F-GR décolle en premier (arrivé au PA avant F-KR). On informe F-GR du TBM7 qui suivra sur le même axe.",
    aircraft: [
      { id: 'F-GR', type: 'departure', x: 373, y: 158, label: 'F-GR', heading: 0 },
      { id: 'F-KR', type: 'departure', x: 373, y: 180, label: 'F-KR', heading: 0 },
    ],
  },
  {
    id: 82,
    time: '10:01:30',
    speaker: { role: 'PILOTE', callsign: 'F-KR', color: 'departure' },
    message: "F-KR, prêt, demande départ de l'intersection",
    expectedResponse:
      "F-KR, trafic au départ vers vent arrière, DR400 via Saint-Amour, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "Info trafic réciproque (livret 5, §4) : F-KR (TBM7) est informé du DR400 parti devant lui sur le même axe. Le TBM7 est plus rapide — risque de rattrapage en montée initiale si la séparation est insuffisante. L'info trafic dans les deux sens est obligatoire dès que deux avions partagent le même point de sortie.",
    aircraft: [
      { id: 'F-GR', type: 'departure', x: 373, y: 132, label: 'F-GR', heading: 270 },
      { id: 'F-KR', type: 'departure', x: 373, y: 158, label: 'F-KR', heading: 0 },
    ],
  },
  {
    id: 83,
    time: '10:02:00',
    speaker: { role: 'PILOTE', callsign: 'F-HR', color: 'arrival' },
    message: 'F-HR, je quitte la fréquence, au revoir',
    expectedResponse: 'F-HR, roger, au revoir',
    teaching:
      "F-HR (C172) au parking A3. Strip archivé. F-GR et F-KR sont tous deux en montée initiale vers Saint-Amour.",
    aircraft: [
      { id: 'F-GR', type: 'departure', x: 80, y: 115, label: 'F-GR', heading: 315 },
      { id: 'F-KR', type: 'departure', x: 373, y: 132, label: 'F-KR', heading: 270 },
      { id: 'F-HR', type: 'arrival', x: 295, y: 245, label: 'F-HR', heading: 0 },
    ],
  },

  // ── Phraséologie ───────────────────────────────────────────────────────────

  {
    id: 84,
    time: '10:02:30',
    speaker: { role: 'PILOTE', callsign: 'F-GR', color: 'departure' },
    message: 'F-GR, quittons la fréquence, au revoir',
    expectedResponse: 'F-GR, roger, au revoir',
    teaching:
      "F-GR (DR400) quitte la zone vers Tours via Saint-Amour. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-GR', type: 'departure', x: 20, y: 50, label: 'F-GR', heading: 315 },
      { id: 'F-KR', type: 'departure', x: 80, y: 115, label: 'F-KR', heading: 315 },
    ],
  },
  {
    id: 85,
    time: '10:03:00',
    speaker: { role: 'PILOTE', callsign: 'F-KR', color: 'departure' },
    message: 'F-KR, quittons la fréquence, au revoir',
    expectedResponse: 'F-KR, roger, au revoir',
    teaching:
      "F-KR (TBM7) quitte la zone vers Caen via Saint-Amour. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-KR', type: 'departure', x: 10, y: 30, label: 'F-KR', heading: 315 },
    ],
  },
  {
    id: 86,
    time: '10:03:00',
    speaker: { role: 'PILOTE', callsign: 'F-HV', color: 'departure' },
    message:
      "AURIOL Tour, FGCHV, Beech 200, poste B2, IFR destination MARSEILLE, demande mise en route, heure estimée de départ 10",
    expectedResponse: "F-HV, roger, je vous rappelle",
    teaching:
      "Départ IFR (livret 5, §1) : un strip IFR (fond orange, imprimé par le BNIA) est déjà sur le tableau d'attente avec ETD 10h10. Au premier contact IFR, le pilote donne callsign complet, type, poste, destination et ETD. La réponse est systématiquement 'roger, je vous rappelle' — le contrôleur doit d'abord appeler BASTIÉ avant de répondre.",
    aircraft: [
      { id: 'F-HV', type: 'departure', x: 345, y: 245, label: 'F-HV', heading: 0 },
    ],
  },
  {
    id: 87,
    time: '10:04:00',
    speaker: { role: 'INFO' },
    message:
      "Le contrôleur appelle BASTIÉ : « Bonjour, AURIOL Tour, demande de mise en route IFR, FGCHV, destination LFML, départ prévu à 10h10. » BASTIÉ répond : « Mise en route approuvée FGCHV, départ à 10h10, rappelez-moi pour la clairance. »",
    expectedResponse:
      "FGCHV, mise en route approuvée pour un départ à 10h10, piste 27 en service, vent 250°/10 kt, QNH 1018, rappelez prêt à rouler",
    teaching:
      "Coordination BASTIÉ (livret 5, §1) : 1. Appel BASTIÉ avec callsign + destination + ETD. 2. BASTIÉ approuve avec ETD confirmée. 3. Transmission au pilote : mise en route approuvée + piste + vent + QNH + instruction 'rappelez prêt à rouler'. On attend le roulage effectif avant de rappeler BASTIÉ pour la clairance (LOA BASTIÉ, tolérance ±1 → +3 min).",
    aircraft: [
      { id: 'F-HV', type: 'departure', x: 345, y: 245, label: 'F-HV', heading: 0 },
    ],
  },
  {
    id: 88,
    time: '10:08:00',
    speaker: { role: 'PILOTE', callsign: 'F-HV', color: 'departure' },
    message: "F-HV, demande roulage",
    expectedResponse:
      "F-HV, roulez point d'attente piste 27, je vous rappelle pour la clairance",
    teaching:
      "F-HV est prêt à rouler. Clairance de roulage standard. La formule 'je vous rappelle pour la clairance' prévient le pilote : ne pas attendre de clairance IFR maintenant. Le contrôleur appelle BASTIÉ dès que F-HV commence à rouler.",
    aircraft: [
      { id: 'F-HV', type: 'departure', x: 373, y: 185, label: 'F-HV', heading: 0 },
    ],
  },
  {
    id: 89,
    time: '10:09:00',
    speaker: { role: 'INFO' },
    message:
      "F-HV est en roulage. Le contrôleur rappelle BASTIÉ : « AURIOL Tour, demande de clairance départ IFR du FGCHV. » BASTIÉ répond : « FGCHV : LSE, 4000 pieds QNH 1018, transpondeur 1401, fréquence 136.080. »",
    expectedResponse:
      "F-HV, rejoignez LSE, 4000 pieds QNH 1018, transpondeur 1401, BASTIÉ Approche en standby 136.080",
    teaching:
      "Clairance IFR transmise élément par élément (livret 5, §1) : balise de sortie (LSE), niveau (4000ft QNH), squawk (transpondeur 1401), fréquence suivante (BASTIÉ Approche 136.080). Chaque élément collationnement par le pilote est souligné sur le strip. Formule type : 'rejoignez [balise], [niveau], transpondeur [code], [organisme] en standby [fréquence]'.",
    aircraft: [
      { id: 'F-HV', type: 'departure', x: 373, y: 158, label: 'F-HV', heading: 0 },
    ],
  },
  {
    id: 90,
    time: '10:10:00',
    speaker: { role: 'PILOTE', callsign: 'F-HV', color: 'departure' },
    message: "F-HV correct, prêt",
    expectedResponse:
      "F-HV, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt",
    teaching:
      "'Correct' signifie que le pilote a collationnement tous les éléments de la clairance IFR. Piste libre → clairance décollage immédiate. On peut aussi combiner remontée + alignement + décollage si nécessaire.",
    aircraft: [
      { id: 'F-HV', type: 'departure', x: 615, y: 132, label: 'F-HV', heading: 270 },
    ],
  },
  {
    id: 91,
    time: '10:11:00',
    speaker: { role: 'PILOTE', callsign: 'F-NR', color: 'arrival' },
    message:
      "AURIOL Tour, FBQNR, Cessna 172, provenance MÂCON via Julienas, pour atterrissage — QFE s'il vous plaît",
    expectedResponse:
      "FBQNR, piste 27 en service, vent 250°/10 kt, QNH 1018, QFE 1006, entrez vent arrière main droite piste 27, rappelez vent arrière",
    teaching:
      "Le QFE n'est transmis que sur demande du pilote (livret 1). Ici QFE 1006 cohérent avec QNH 1018 (piste à ~350ft). Ordre de la réponse : piste → vent → QNH → QFE (si demandé) → instruction d'intégration. On ne donne jamais le QFE spontanément.",
    aircraft: [
      { id: 'F-NR', type: 'arrival', x: 130, y: 30, label: 'F-NR', heading: 135 },
      { id: 'F-HV', type: 'departure', x: 60, y: 115, label: 'F-HV', heading: 270 },
    ],
  },
  {
    id: 92,
    time: '10:11:30',
    speaker: { role: 'PILOTE', callsign: 'F-NR', color: 'arrival' },
    message:
      "Piste 27, QNH 1020, je m'intègre vent arrière, F-NR",
    expectedResponse: "F-NR, négatif, QNH 1018, confirmer",
    teaching:
      "Collationnement erroné : F-NR a répété QNH 1020 (ancien QNH) au lieu de 1018. Le contrôleur doit corriger immédiatement avec 'négatif' + valeur correcte + 'confirmer'. Cette correction est prioritaire : une erreur de QNH génère une erreur d'altitude et peut créer un conflit avec le circuit (1400ft QNH).",
    aircraft: [
      { id: 'F-NR', type: 'arrival', x: 175, y: 60, label: 'F-NR', heading: 135 },
      { id: 'F-HV', type: 'departure', x: 30, y: 90, label: 'F-HV', heading: 270 },
    ],
  },
  {
    id: 93,
    time: '10:12:00',
    speaker: { role: 'PILOTE', callsign: 'F-HV', color: 'departure' },
    message: "F-HV, je quitte la fréquence, bonjour BASTIÉ",
    expectedResponse: "F-HV, roger, au revoir",
    teaching:
      "F-HV (BE20 IFR) quitte la fréquence TWR pour contacter BASTIÉ Approche (136.080). Strip archivé avec heure de dernier contact. On note également l'heure de décollage pour le service d'alerte (plan de vol actif).",
    aircraft: [
      { id: 'F-NR', type: 'arrival', x: 220, y: 85, label: 'F-NR', heading: 90 },
    ],
  },
  {
    id: 94,
    time: '10:20:00',
    speaker: { role: 'PILOTE', callsign: 'F-NR', color: 'arrival' },
    message: 'F-NR, au parking, pour quitter la fréquence',
    expectedResponse: 'F-NR, roger, au revoir',
    teaching:
      "F-NR (C172) est garé au parking après atterrissage. On accuse réception sobrement. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-NR', type: 'arrival', x: 350, y: 245, label: 'F-NR', heading: 0 },
    ],
  },

];

const SCENARIO_3_STEPS = [
  {
    id: 1,
    time: '16:07:00',
    speaker: { role: 'INFO' },
    message:
      "Situation initiale. Piste 27 en service, vent 250°/10kt, QNH 1009 (QFE 997). En contact : FBVXH (C172, de LFLB via Penent, A/D 16:12, en approche directe, rappelle longue finale). Trois strips impriment du BNIA : ITINE (BE20, DEP 16:10 vers LFLC via Chiroubles), FGFQP (R300, DEP 16:25 vers LFMK via BST), FGBRK (R300, ARR 16:30 de LFSR via Saint-Amour).",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 720, y: 131, label: 'F-XH', heading: 270 },
    ],
  },
  {
    id: 2,
    time: '16:07:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'departure' },
    message: 'AURIOL Tour, FGBXN, Trinidad, parking D aéroclub, destination BORDEAUX via Chiroubles, demande roulage',
    expectedResponse: 'FGBXN, piste 27 en service, vent 250°/10kt, QNH 1009, roulez point d\'attente piste 27',
    teaching:
      "Première communication — callsign complet FGBXN. Parking D (aéroclub) non visible depuis la tour : on ne confirme pas le poste, on donne directement le roulage. Strip rouge (départ).",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 700, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 210, y: 224, label: 'F-XN', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 3,
    time: '16:07:30',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'Sécurité, au hangar SSLIA, demande roulage pour la pompe',
    expectedResponse: 'Sécurité, attendez, trafic au roulage',
    teaching:
      "F-XN a appelé en premier (16:07:00) → il est prioritaire. La SÉCU veut aller vers la pompe sur le même taxiway que F-XN : conflit au roulage. On maintient la SÉCU jusqu'au passage du Trinidad.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 680, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 230, y: 195, label: 'F-XN', heading: 90 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 4,
    time: '16:08:10',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'arrival' },
    message: 'AURIOL Tour, FGAMR, Twin Otter, provenance LA ROCHELLE, dans l\'ouest du terrain, 3000 pieds QNH en descente, estimons l\'aérodrome dans 5 minutes, demandons intégration',
    expectedResponse: 'FGAMR, piste 27 en service, vent 250°/10kt, QNH 1009, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "Première communication — callsign complet FGAMR. F-MR arrive de l'Ouest (Chiroubles) → intégration directe en vent arrière main droite, pas de vertical tour. Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 660, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 310, y: 178, label: 'F-XN', heading: 90 },
      { id: 'F-MR', type: 'arrival', x: 30, y: 131, label: 'F-MR', heading: 90 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 5,
    time: '16:08:30',
    speaker: { role: 'INFO' },
    message: "F-XN vient de dégager la zone du taxiway vers la pompe. La tour prend l'initiative et autorise la SÉCU.",
    expectedResponse: 'Sécurité, roulez vers la pompe',
    teaching:
      "Dès que le conflit est levé (F-XN a passé), on autorise le véhicule sur initiative de la tour. La SÉCU n'a pas besoin de rappeler.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 650, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 373, y: 158, label: 'F-XN', heading: 0 },
      { id: 'F-MR', type: 'arrival', x: 50, y: 131, label: 'F-MR', heading: 90 },
      { id: 'SECU', type: 'vehicle', x: 460, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 6,
    time: '16:09:00',
    speaker: { role: 'PILOTE', callsign: 'F-XH', color: 'arrival' },
    message: 'F-XH, longue finale piste 27',
    expectedResponse: 'F-XH, numéro 1, rappelez finale piste 27',
    teaching:
      "F-XH rappelle longue finale. Piste libre et circuit libre → n°1. On demande le rappel finale ; la clairance d'atterrissage sera donnée à ce rappel.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 645, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 373, y: 158, label: 'F-XN', heading: 0 },
      { id: 'F-MR', type: 'arrival', x: 70, y: 131, label: 'F-MR', heading: 90 },
    ],
  },
  {
    id: 7,
    time: '16:09:10',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'departure' },
    message: 'F-XN, prêt au départ de l\'intersection',
    expectedResponse: 'F-XN, trafic de l\'Ouest vers vent arrière, Twin Otter, alignez-vous, piste 27 autorisé décollage, vent 250°/10kt',
    teaching:
      "F-XN décolle vers Chiroubles (Ouest). F-MR arrive de l'Ouest et va intégrer en vent arrière : leurs trajectoires se croisent à l'Ouest. Info trafic réciproque obligatoire avant la clairance décollage.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 640, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 373, y: 155, label: 'F-XN', heading: 270 },
      { id: 'F-MR', type: 'arrival', x: 90, y: 131, label: 'F-MR', heading: 90 },
    ],
  },
  {
    id: 8,
    time: '16:09:20',
    speaker: { role: 'INFO' },
    message: "F-XN est en train de décoller. La tour donne l'info réciproque à F-MR sur le trafic au départ.",
    expectedResponse: 'F-MR, trafic au départ vers Chiroubles, Trinidad',
    teaching:
      "Info trafic réciproque : après avoir informé F-XN de F-MR, on informe F-MR de F-XN. F-MR ne rappellera pas forcément « trafic en vue » — c'est une information, pas une clairance conditionnelle.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 636, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 260, y: 131, label: 'F-XN', heading: 270 },
      { id: 'F-MR', type: 'arrival', x: 110, y: 131, label: 'F-MR', heading: 90 },
    ],
  },
  {
    id: 9,
    time: '16:09:50',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'Sécurité, à la pompe, pour quitter la fréquence',
    expectedResponse: 'Sécurité, roger, au revoir',
    teaching:
      "La SÉCU a accompli sa mission et quitte la fréquence. Strip SÉCURITÉ archivé.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 630, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-XN', type: 'departure', x: 150, y: 115, label: 'F-XN', heading: 270 },
      { id: 'F-MR', type: 'arrival', x: 130, y: 131, label: 'F-MR', heading: 90 },
    ],
  },
  {
    id: 10,
    time: '16:10:00',
    speaker: { role: 'PILOTE', callsign: 'F-XH', color: 'arrival' },
    message: 'F-XH, finale piste 27, pour un atterrissage court',
    expectedResponse: 'F-XH, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "F-XH est en finale. F-XN a décollé et dégagé la piste (extrémité franchie) → piste libre. Clairance atterrissage avec le vent. La piste est occupée dès cet instant.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 595, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-MR', type: 'arrival', x: 160, y: 100, label: 'F-MR', heading: 90 },
    ],
  },
  {
    id: 11,
    time: '16:10:50',
    speaker: { role: 'PILOTE', callsign: 'I-NE', color: 'departure' },
    message: 'AURIOL Tower, ITINE, Beech 200, VFR with flight plan, stand B1, destination CLERMONT FERRAND via CHIROUBLES, requesting taxi',
    expectedResponse: 'ITINE, runway 27 in use, wind 250°/10kt, QNH 1009, Cessna 172 vacating runway via H2, follow then taxi holding point runway 27',
    teaching:
      "ITINE appelle en anglais → réponse en anglais, callsign complet. F-XH dégage en ce moment via H2 et se dirige vers le parking : ITINE (B1→H2) est en conflit de roulage. On fait suivre ITINE derrière F-XH.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 430, y: 131, label: 'F-XH', heading: 270 },
      { id: 'F-MR', type: 'arrival', x: 200, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 340, y: 235, label: 'I-NE', heading: 0 },
    ],
  },
  {
    id: 12,
    time: '16:12:30',
    speaker: { role: 'PILOTE', callsign: 'F-XH', color: 'arrival' },
    message: 'F-XH, piste dégagée, demande roulage',
    expectedResponse: 'F-XH, roulez poste C3',
    teaching:
      "F-XH a dégagé via H2. On lui attribue le poste C3 (C172 au parking principal). Strip F-XH passe sous la barrette (roulage en cours). ITINE peut maintenant progresser vers H2.",
    aircraft: [
      { id: 'F-XH', type: 'arrival', x: 373, y: 175, label: 'F-XH', heading: 180 },
      { id: 'F-MR', type: 'arrival', x: 260, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 350, y: 210, label: 'I-NE', heading: 90 },
    ],
  },
  {
    id: 13,
    time: '16:12:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'departure' },
    message: 'F-XN, quittons la fréquence, au revoir',
    expectedResponse: 'F-XN, roger, au revoir',
    teaching:
      "F-XN quitte la fréquence TWR pour BORDEAUX. Strip archivé avec heure de décollage.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 280, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 355, y: 190, label: 'I-NE', heading: 90 },
      { id: 'F-XH', type: 'arrival', x: 420, y: 235, label: 'F-XH', heading: 0 },
    ],
  },
  {
    id: 14,
    time: '16:12:40',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'arrival' },
    message: 'F-MR, vent arrière main droite piste 27',
    expectedResponse: 'F-MR, numéro 1, rappelez finale piste 27',
    teaching:
      "F-MR rappelle vent arrière. Circuit libre, piste libre → n°1. On demande le rappel finale. Strip F-MR descend juste au-dessus de la barrette piste.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 310, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 373, y: 162, label: 'I-NE', heading: 0 },
    ],
  },
  {
    id: 15,
    time: '16:13:20',
    speaker: { role: 'PILOTE', callsign: 'F-XH', color: 'arrival' },
    message: 'F-XH, au parking, pour quitter la fréquence',
    expectedResponse: 'F-XH, roger, au revoir',
    teaching:
      "F-XH est garé au poste C3. Strip archivé avec heure de dernier contact.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 350, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 373, y: 162, label: 'I-NE', heading: 0 },
    ],
  },
  {
    id: 16,
    time: '16:13:50',
    speaker: { role: 'PILOTE', callsign: 'I-NE', color: 'departure' },
    message: 'I-NE, ready to backtrack runway 27',
    expectedResponse: 'I-NE, hold position, Twin Otter abeam tower on downwind — puis : F-MR, prolongez vent arrière, avion en attente de remonter piste 27',
    teaching:
      "F-MR a passé le travers tour (verrou actif pour une remontée). On maintient I-NE ET on fait allonger F-MR pour lui dégager le temps de remonter et décoller avant que F-MR arrive en finale.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 390, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 373, y: 162, label: 'I-NE', heading: 0 },
    ],
  },
  {
    id: 17,
    time: '16:14:50',
    speaker: { role: 'PILOTE', callsign: 'F-OL', color: 'arrival' },
    message: 'AURIOL Tour, FGDOL, Cessna 172, provenance RENNES, estimons JULIENAS à 15, l\'aérodrome à 19, 2000 pieds QNH en descente, demandons intégration',
    expectedResponse: 'FGDOL, piste 27 en service, vent 250°/10kt, QNH 1009, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "F-OL arrive par Julienas (Nord) → intégration directe en vent arrière main droite, pas de vertical tour. Callsign complet FGDOL au premier contact. Strip bleu.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 460, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 373, y: 162, label: 'I-NE', heading: 0 },
      { id: 'F-OL', type: 'arrival', x: 180, y: 30, label: 'F-OL', heading: 180 },
    ],
  },
  {
    id: 18,
    time: '16:15:50',
    speaker: { role: 'PILOTE', callsign: 'I-NE', color: 'departure' },
    message: 'I-NE, ready for departure',
    expectedResponse: 'I-NE, runway 27 cleared for takeoff, wind 250°/10kt',
    teaching:
      "F-MR a prolongé son vent arrière suffisamment. I-NE a terminé sa remontée et est aligné au seuil 27. Piste libre → clairance décollage sur initiative de la tour (ou sur rappel du pilote comme ici).",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 520, y: 89, label: 'F-MR', heading: 90 },
      { id: 'I-NE', type: 'departure', x: 615, y: 131, label: 'I-NE', heading: 270 },
      { id: 'F-OL', type: 'arrival', x: 180, y: 55, label: 'F-OL', heading: 180 },
    ],
  },
  {
    id: 19,
    time: '16:17:00',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'arrival' },
    message: 'F-MR, finale piste 27',
    expectedResponse: 'F-MR, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "I-NE a franchi l'extrémité de piste → piste libre. F-MR est en finale → clairance atterrissage avec vent. Piste occupée dès cet instant.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 590, y: 131, label: 'F-MR', heading: 270 },
      { id: 'I-NE', type: 'departure', x: 50, y: 110, label: 'I-NE', heading: 270 },
      { id: 'F-OL', type: 'arrival', x: 180, y: 80, label: 'F-OL', heading: 180 },
    ],
  },
  {
    id: 20,
    time: '16:17:20',
    speaker: { role: 'PILOTE', callsign: 'F-JA', color: 'departure' },
    message: 'AURIOL Tour, FGFJA, Robin 3000, parking D aéroclub, destination GAP via Fleurie, demande roulage',
    expectedResponse: 'FGFJA, piste 27 en service, vent 250°/10kt, QNH 1009, laissez passer le Twin Otter de la piste vers le parking, puis roulez point d\'attente piste 27',
    teaching:
      "F-JA (parking D) veut rouler vers H2 : même taxiway que F-MR qui va dégage via H2. On fait attendre F-JA jusqu'au passage du Twin Otter. Callsign complet FGFJA. Strip rouge.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 450, y: 131, label: 'F-MR', heading: 270 },
      { id: 'F-JA', type: 'departure', x: 210, y: 224, label: 'F-JA', heading: 0 },
      { id: 'F-OL', type: 'arrival', x: 180, y: 100, label: 'F-OL', heading: 180 },
    ],
  },
  {
    id: 21,
    time: '16:18:00',
    speaker: { role: 'PILOTE', callsign: 'F-MR', color: 'arrival' },
    message: 'F-MR, piste dégagée, demande roulage',
    expectedResponse: 'F-MR, roulez poste A4',
    teaching:
      "F-MR dégage via H2. On lui attribue le poste A4 (DHC-6, parking principal). Strip F-MR passe sous la barrette. F-JA peut maintenant rouler.",
    aircraft: [
      { id: 'F-MR', type: 'arrival', x: 373, y: 178, label: 'F-MR', heading: 180 },
      { id: 'F-JA', type: 'departure', x: 230, y: 195, label: 'F-JA', heading: 90 },
      { id: 'F-OL', type: 'arrival', x: 180, y: 120, label: 'F-OL', heading: 180 },
    ],
  },
  {
    id: 22,
    time: '16:18:10',
    speaker: { role: 'PILOTE', callsign: 'F-OL', color: 'arrival' },
    message: 'F-OL, vent arrière main droite piste 27',
    expectedResponse: 'F-OL, numéro 1, rappelez finale piste 27',
    teaching:
      "F-MR a atterri, circuit libre → F-OL est n°1. On demande le rappel finale. Strip F-OL descend juste au-dessus de la barrette.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 200, y: 89, label: 'F-OL', heading: 90 },
      { id: 'F-JA', type: 'departure', x: 310, y: 178, label: 'F-JA', heading: 90 },
    ],
  },
  {
    id: 23,
    time: '16:18:30',
    speaker: { role: 'PILOTE', callsign: 'F-KZ', color: 'arrival' },
    message: 'AURIOL Tour, FGEKZ, Robin 3000, provenance MELUN, passons SAINT-AMOUR, 2500 pieds QNH en descente, l\'aérodrome estimé à 23, demandons intégration',
    expectedResponse: 'FGEKZ, piste 27 en service, vent 250°/10kt, QNH 1009, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "F-KZ passe Saint-Amour (NW) → intégration directe en vent arrière main droite, pas de vertical tour. Callsign complet FGEKZ. Strip bleu.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 230, y: 89, label: 'F-OL', heading: 90 },
      { id: 'F-JA', type: 'departure', x: 360, y: 162, label: 'F-JA', heading: 0 },
      { id: 'F-KZ', type: 'arrival', x: 60, y: 55, label: 'F-KZ', heading: 135 },
    ],
  },
  {
    id: 24,
    time: '16:19:40',
    speaker: { role: 'PILOTE', callsign: 'I-NE', color: 'departure' },
    message: 'I-NE, passing CHIROUBLES leaving frequency, good day',
    expectedResponse: 'I-NE, roger, good day',
    teaching:
      "I-NE (ITINE, VFR FPL) quitte la fréquence TWR en passant Chiroubles. Strip archivé ; noter heure décollage pour le service d'alerte du plan de vol.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 270, y: 89, label: 'F-OL', heading: 90 },
      { id: 'F-JA', type: 'departure', x: 373, y: 162, label: 'F-JA', heading: 0 },
      { id: 'F-KZ', type: 'arrival', x: 80, y: 65, label: 'F-KZ', heading: 135 },
    ],
  },
  {
    id: 25,
    time: '16:20:10',
    speaker: { role: 'INFO' },
    message: "Appel téléphonique météo : nouveau QNH 1010, QFE 998. À transmettre à tous les aéronefs concernés.",
    expectedResponse: 'F-OL, nouveaux paramètres : QNH 1010, QFE 998 — F-KZ, nouveaux paramètres : QNH 1010, QFE 998 — F-JA, nouveaux paramètres : QNH 1010, QFE 998',
    teaching:
      "Après collation des nouvelles valeurs météo, on transmet IMMÉDIATEMENT à tous les A/C en vol ou au sol dans la zone. Ne pas oublier un seul aéronef en fréquence.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 300, y: 89, label: 'F-OL', heading: 90 },
      { id: 'F-JA', type: 'departure', x: 373, y: 162, label: 'F-JA', heading: 0 },
      { id: 'F-KZ', type: 'arrival', x: 100, y: 72, label: 'F-KZ', heading: 135 },
    ],
  },
  {
    id: 26,
    time: '16:21:50',
    speaker: { role: 'PILOTE', callsign: 'F-OL', color: 'arrival' },
    message: 'F-OL, finale piste 27, pour un atterrissage court',
    expectedResponse: 'F-OL, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "F-OL est en finale. Piste libre → clairance atterrissage. Piste occupée dès cet instant.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 590, y: 131, label: 'F-OL', heading: 270 },
      { id: 'F-JA', type: 'departure', x: 373, y: 155, label: 'F-JA', heading: 270 },
      { id: 'F-KZ', type: 'arrival', x: 130, y: 89, label: 'F-KZ', heading: 90 },
    ],
  },
  {
    id: 27,
    time: '16:22:10',
    speaker: { role: 'PILOTE', callsign: 'F-JA', color: 'departure' },
    message: 'F-JA, prêt au départ de l\'intersection',
    expectedResponse: 'F-JA, attendez, Cessna 172 en finale',
    teaching:
      "F-OL est en finale → verrou actif pour un départ depuis l'intersection (verrou = arrivée en finale). F-JA doit attendre que F-OL dégage avant d'être autorisé.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 560, y: 131, label: 'F-OL', heading: 270 },
      { id: 'F-JA', type: 'departure', x: 373, y: 155, label: 'F-JA', heading: 270 },
      { id: 'F-KZ', type: 'arrival', x: 160, y: 89, label: 'F-KZ', heading: 90 },
    ],
  },
  {
    id: 28,
    time: '16:22:40',
    speaker: { role: 'PILOTE', callsign: 'F-KZ', color: 'arrival' },
    message: 'F-KZ, vent arrière main droite piste 27',
    expectedResponse: 'F-KZ, numéro 1, rappelez finale piste 27',
    teaching:
      "F-OL vient d'atterrir (ou est en courte finale) → F-KZ est n°1. Attention : F-OL n'a pas encore dégagé, la piste est toujours occupée. On donne juste le n°1 et le rappel finale.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 400, y: 131, label: 'F-OL', heading: 270 },
      { id: 'F-JA', type: 'departure', x: 373, y: 155, label: 'F-JA', heading: 270 },
      { id: 'F-KZ', type: 'arrival', x: 200, y: 89, label: 'F-KZ', heading: 90 },
    ],
  },
  {
    id: 29,
    time: '16:23:30',
    speaker: { role: 'PILOTE', callsign: 'F-OL', color: 'arrival' },
    message: 'F-OL, piste dégagée',
    expectedResponse: 'F-OL, roulez poste B2 — puis : F-JA, alignez-vous, piste 27 autorisé décollage, vent 250°/10kt',
    teaching:
      "Dès que F-OL dégage, on lui attribue un poste ET on initie immédiatement la clairance décollage pour F-JA (qui attendait à l'intersection). Pas besoin que F-JA rappelle : c'est la tour qui prend l'initiative.",
    aircraft: [
      { id: 'F-OL', type: 'arrival', x: 373, y: 178, label: 'F-OL', heading: 180 },
      { id: 'F-JA', type: 'departure', x: 373, y: 155, label: 'F-JA', heading: 270 },
      { id: 'F-KZ', type: 'arrival', x: 250, y: 89, label: 'F-KZ', heading: 90 },
    ],
  },
  {
    id: 30,
    time: '16:25:20',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'AURIOL Tour, FBTYU, Cessna 310, parking principal C1, destination RENNES via Julienas, demandons roulage',
    expectedResponse: 'FBTYU, piste 27 en service, vent 250°/10kt, QNH 1010, roulez point d\'attente piste 27',
    teaching:
      "Première communication — callsign complet FBTYU. Le QNH est maintenant 1010 (mis à jour à 16:20). Attendre que le pilote collationne.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 330, y: 89, label: 'F-KZ', heading: 90 },
      { id: 'F-JA', type: 'departure', x: 140, y: 115, label: 'F-JA', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 380, y: 235, label: 'F-YU', heading: 0 },
    ],
  },
  {
    id: 31,
    time: '16:25:30',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'QNH 1006, F-YU',
    expectedResponse: 'F-YU, négatif, QNH 1010, collationnez',
    teaching:
      "Le pilote a collationné QNH 1006 au lieu de 1010 : erreur grave de collationnement. Correction immédiate obligatoire : « négatif » + valeur correcte + demande de re-collation. Ne jamais laisser passer un mauvais QNH.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 360, y: 89, label: 'F-KZ', heading: 90 },
      { id: 'F-YU', type: 'departure', x: 380, y: 235, label: 'F-YU', heading: 0 },
    ],
  },
  {
    id: 32,
    time: '16:26:30',
    speaker: { role: 'PILOTE', callsign: 'F-KZ', color: 'arrival' },
    message: 'F-KZ, finale piste 27',
    expectedResponse: 'F-KZ, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "F-KZ rappelle finale. F-JA est parti, piste libre → clairance atterrissage. Piste occupée dès cet instant.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 590, y: 131, label: 'F-KZ', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 373, y: 162, label: 'F-YU', heading: 0 },
    ],
  },
  {
    id: 33,
    time: '16:26:50',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'F-YU, prêt à remonter piste 27',
    expectedResponse: 'F-YU, maintenez avant point d\'attente piste 27, Robin 3000 en finale, rappelez en vue',
    teaching:
      "F-KZ est en finale → verrou actif pour une remontée. Phase 1 de l'alignement conditionnel : maintien + demande de rappel en vue pour identifier visuellement le trafic de référence.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 560, y: 131, label: 'F-KZ', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 373, y: 162, label: 'F-YU', heading: 0 },
    ],
  },
  {
    id: 34,
    time: '16:27:00',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'Robin 3000 en vue, F-YU',
    expectedResponse: 'F-YU, derrière le Robin 3000 en finale, remontez piste 27, alignez-vous et attendez derrière',
    teaching:
      "Phase 2 de l'alignement conditionnel : le pilote a confirmé le visuel sur F-KZ. La clairance conditionnelle précise l'ordre exact : « derrière le [type] en [situation] ». F-YU peut entrer sur la piste dans le sillage de F-KZ.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 530, y: 131, label: 'F-KZ', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 373, y: 162, label: 'F-YU', heading: 0 },
    ],
  },
  {
    id: 35,
    time: '16:27:30',
    speaker: { role: 'PILOTE', callsign: 'F-BC', color: 'arrival' },
    message: 'AURIOL Tour, FBUBC, Cessna 172, provenance BREST, dans le nord-ouest du terrain, estimé dans 6 minutes, 2500 pieds QNH en descente, demandons intégration',
    expectedResponse: 'FBUBC, piste 27 en service, vent 250°/10kt, QNH 1010, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "F-BC arrive du NW (LFRB). Callsign complet FBUBC. NW → vent arrière main droite directement, pas de vertical tour. Strip bleu.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 450, y: 131, label: 'F-KZ', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 540, y: 131, label: 'F-YU', heading: 270 },
      { id: 'F-BC', type: 'arrival', x: 60, y: 55, label: 'F-BC', heading: 135 },
    ],
  },
  {
    id: 36,
    time: '16:28:00',
    speaker: { role: 'PILOTE', callsign: 'F-KZ', color: 'arrival' },
    message: 'F-KZ, piste dégagée, demandons le parking aéroclub',
    expectedResponse: 'F-KZ, roulez parking D',
    teaching:
      "Le pilote demande lui-même le parking D (aéroclub) → on dit simplement « roulez parking D » sans numéro de poste, car le parking D n'est pas visible depuis la tour. Strip archivé.",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 373, y: 178, label: 'F-KZ', heading: 180 },
      { id: 'F-YU', type: 'departure', x: 615, y: 131, label: 'F-YU', heading: 270 },
      { id: 'F-BC', type: 'arrival', x: 80, y: 68, label: 'F-BC', heading: 135 },
    ],
  },
  {
    id: 37,
    time: '16:29:00',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'AURIOL Tour, FGFQP, Robin 3000, VFR avec plan de vol, parking D aéroclub, destination CARCASSONNE via BST, demande roulage',
    expectedResponse: 'FGFQP, piste 27 en service, vent 250°/10kt, QNH 1010, laissez passer le Robin 3000 vers le parking D, puis roulez point d\'attente piste 27',
    teaching:
      "F-QP (parking D sortant) croise F-KZ (parking D entrant) sur le même taxiway. Callsign complet FGFQP. Strip rouge (départ VFR FPL = bord orange/strip imprimé).",
    aircraft: [
      { id: 'F-KZ', type: 'arrival', x: 240, y: 195, label: 'F-KZ', heading: 270 },
      { id: 'F-YU', type: 'departure', x: 615, y: 131, label: 'F-YU', heading: 270 },
      { id: 'F-BC', type: 'arrival', x: 100, y: 79, label: 'F-BC', heading: 135 },
      { id: 'F-QP', type: 'departure', x: 210, y: 224, label: 'F-QP', heading: 0 },
    ],
  },
  {
    id: 38,
    time: '16:29:50',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'F-YU, prêt au départ',
    expectedResponse: 'F-YU, trafic du Nord-Ouest vers vent arrière, Cessna 172, piste 27 autorisé décollage, vent 250°/10kt — puis : F-BC, trafic au départ vers Julienas, Cessna 310',
    teaching:
      "F-YU décolle vers Julienas (N). F-BC arrive du NW et va entrer en vent arrière : les trajectoires se croisent au NW. Info réciproque obligatoire dans les deux sens avant et après décollage.",
    aircraft: [
      { id: 'F-YU', type: 'departure', x: 615, y: 131, label: 'F-YU', heading: 270 },
      { id: 'F-BC', type: 'arrival', x: 120, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 230, y: 195, label: 'F-QP', heading: 90 },
    ],
  },
  {
    id: 39,
    time: '16:31:00',
    speaker: { role: 'PILOTE', callsign: 'F-JA', color: 'departure' },
    message: 'F-JA, quittons la fréquence, au revoir',
    expectedResponse: 'F-JA, roger, au revoir',
    teaching:
      "F-JA quitte la fréquence TWR pour GAP via Fleurie. Strip archivé.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 155, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 310, y: 178, label: 'F-QP', heading: 90 },
    ],
  },
  {
    id: 40,
    time: '16:32:10',
    speaker: { role: 'PILOTE', callsign: 'F-BC', color: 'arrival' },
    message: 'F-BC, vent arrière main droite piste 27',
    expectedResponse: 'F-BC, numéro 1, rappelez finale piste 27',
    teaching:
      "F-YU est parti, circuit libre → F-BC n°1. Strip F-BC juste au-dessus de la barrette.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 200, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 360, y: 162, label: 'F-QP', heading: 0 },
    ],
  },
  {
    id: 41,
    time: '16:32:20',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'F-QP, prêt au départ de l\'intersection',
    expectedResponse: 'F-QP, trafic du Sud vers vertical, Beech 200, alignez-vous, piste 27 autorisé décollage, vent 250°/10kt',
    teaching:
      "F-BC est en vent arrière mais n'a pas encore passé le travers tour → verrou non actif pour l'intersection. F-QP peut décoller. H-JN arrive du sud (BST = Morgon) : info trafic réciproque F-QP/H-JN obligatoire.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 230, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 373, y: 155, label: 'F-QP', heading: 270 },
    ],
  },
  {
    id: 42,
    time: '16:32:40',
    speaker: { role: 'PILOTE', callsign: 'H-JN', color: 'arrival' },
    message: 'AURIOL Tower, HBEJN, Beech 200, from PERPIGNAN, passing BST, airfield estimated in 5 minutes, 3500 feet QNH descending, requesting joining instructions',
    expectedResponse: 'HBEJN, runway 27 in use, wind 250°/10kt, QNH 1010, join right hand downwind runway 27 via overhead tower, report overhead tower — then : H-JN, traffic departing to the south, Robin 300',
    teaching:
      "Pilote anglais → réponse en anglais, callsign complet HBEJN. BST (Bastié VOR) est au sud : arrivée par le sud → vertical tour obligatoire. Info réciproque H-JN/F-QP (deux trafics convergeant vers le secteur sud).",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 260, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 260, y: 131, label: 'F-QP', heading: 270 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 390, label: 'H-JN', heading: 0 },
    ],
  },
  {
    id: 43,
    time: '16:34:00',
    speaker: { role: 'PILOTE', callsign: 'F-YU', color: 'departure' },
    message: 'F-YU, passons JULIENAS, quittons la fréquence, au revoir',
    expectedResponse: 'F-YU, roger, au revoir',
    teaching:
      "F-YU (FBTYU, VFR FPL) quitte la fréquence en passant Julienas. Strip archivé avec heure décollage pour le service d'alerte.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 320, y: 89, label: 'F-BC', heading: 90 },
      { id: 'F-QP', type: 'departure', x: 100, y: 131, label: 'F-QP', heading: 270 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 320, label: 'H-JN', heading: 0 },
    ],
  },
  {
    id: 44,
    time: '16:34:50',
    speaker: { role: 'PILOTE', callsign: 'F-QP', color: 'departure' },
    message: 'F-QP, quittons la fréquence, au revoir',
    expectedResponse: 'F-QP, roger, au revoir',
    teaching:
      "F-QP (FGFQP, VFR FPL) quitte la fréquence. Strip archivé avec heure décollage.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 360, y: 89, label: 'F-BC', heading: 90 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 260, label: 'H-JN', heading: 0 },
    ],
  },
  {
    id: 45,
    time: '16:35:00',
    speaker: { role: 'PILOTE', callsign: 'F-RK', color: 'arrival' },
    message: 'AURIOL Tour, FGBRK, Robin 3000, VFR avec plan de vol, provenance REIMS, via SAINT-AMOUR, 3000 pieds QNH en descente, l\'aérodrome estimé à 41, demandons intégration',
    expectedResponse: 'FGBRK, piste 27 en service, vent 250°/10kt, QNH 1010, entrez vent arrière main droite piste 27, rappelez vent arrière',
    teaching:
      "F-RK (FGBRK, VFR FPL) arrive de Saint-Amour (NW). Callsign complet. NW → vent arrière directement. Strip bleu (fond orange car FPL imprimé).",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 390, y: 89, label: 'F-BC', heading: 90 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 200, label: 'H-JN', heading: 0 },
      { id: 'F-RK', type: 'arrival', x: 60, y: 55, label: 'F-RK', heading: 135 },
    ],
  },
  {
    id: 46,
    time: '16:35:50',
    speaker: { role: 'PILOTE', callsign: 'F-BC', color: 'arrival' },
    message: 'F-BC, finale piste 27',
    expectedResponse: 'F-BC, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "F-BC rappelle finale. Piste libre → clairance atterrissage.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 590, y: 131, label: 'F-BC', heading: 270 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 160, label: 'H-JN', heading: 0 },
      { id: 'F-RK', type: 'arrival', x: 80, y: 68, label: 'F-RK', heading: 135 },
    ],
  },
  {
    id: 47,
    time: '16:36:00',
    speaker: { role: 'PILOTE', callsign: 'H-JN', color: 'arrival' },
    message: 'H-JN, overhead tower',
    expectedResponse: 'H-JN, report right hand downwind runway 27',
    teaching:
      "H-JN est au vertical aérodrome (vertical tour). On lui demande de rappeler vent arrière pour l'intégrer dans la séquence.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 500, y: 131, label: 'F-BC', heading: 270 },
      { id: 'H-JN', type: 'arrival', x: 370, y: 135, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 100, y: 79, label: 'F-RK', heading: 135 },
    ],
  },
  {
    id: 48,
    time: '16:36:50',
    speaker: { role: 'PILOTE', callsign: 'D-KW', color: 'transit' },
    message: 'AURIOL Tower, DISKW, Piper Aztec, VFR transit, from MONTPELLIER to STRASBOURG, 3000 feet QNH, via MORGON, over airfield time 43, northeast of airfield next',
    expectedResponse: 'DISKW, runway 27 in use, QNH 1010, report overhead airfield',
    teaching:
      "Transit → piste en service + QNH uniquement (pas de vent). Callsign complet DISKW. On demande le rappel au vertical aérodrome.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 350, y: 131, label: 'F-BC', heading: 270 },
      { id: 'H-JN', type: 'arrival', x: 540, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 130, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 370, y: 320, label: 'D-KW', heading: 0 },
    ],
  },
  {
    id: 49,
    time: '16:37:50',
    speaker: { role: 'PILOTE', callsign: 'F-BC', color: 'arrival' },
    message: 'F-BC, piste dégagée',
    expectedResponse: 'F-BC, roulez poste B2',
    teaching:
      "F-BC dégage via H2. On lui attribue le poste B2 (C172, parking principal). Strip archivé.",
    aircraft: [
      { id: 'F-BC', type: 'arrival', x: 373, y: 178, label: 'F-BC', heading: 180 },
      { id: 'H-JN', type: 'arrival', x: 480, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 170, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 370, y: 240, label: 'D-KW', heading: 0 },
    ],
  },
  {
    id: 50,
    time: '16:38:30',
    speaker: { role: 'PILOTE', callsign: 'F-MS', color: 'departure' },
    message: 'AURIOL Tour, FBTMS, Piper Aztec, parking C3, destination TOULOUSE via BST, demande roulage',
    expectedResponse: 'FBTMS, piste 27 en service, vent 250°/10kt, QNH 1010, roulez point d\'attente piste 27',
    teaching:
      "Première communication — callsign complet FBTMS. F-MS (PA27, C3) roule vers H2. Strip rouge.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 420, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 210, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 370, y: 180, label: 'D-KW', heading: 0 },
      { id: 'F-MS', type: 'departure', x: 430, y: 235, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 51,
    time: '16:39:40',
    speaker: { role: 'PILOTE', callsign: 'H-JN', color: 'arrival' },
    message: 'H-JN, right hand downwind runway 27',
    expectedResponse: 'H-JN, number 1, report final',
    teaching:
      "H-JN rappelle vent arrière après vertical tour. F-BC a atterri, circuit libre → H-JN n°1. On demande le rappel finale.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 360, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 250, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 370, y: 131, label: 'D-KW', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 52,
    time: '16:41:00',
    speaker: { role: 'PILOTE', callsign: 'D-KW', color: 'transit' },
    message: 'D-KW, over airfield',
    expectedResponse: 'D-KW, report MORGON',
    teaching:
      "D-KW est au vertical aérodrome. On lui demande de rappeler au point de sortie (Morgon, cap NE). Le transit est à 3000ft QNH : aucun conflit avec le circuit (1400ft) ni les remises de gaz.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 290, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 300, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 370, y: 89, label: 'D-KW', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 53,
    time: '16:41:40',
    speaker: { role: 'PILOTE', callsign: 'F-RK', color: 'arrival' },
    message: 'F-RK, vent arrière main droite piste 27',
    expectedResponse: 'F-RK, numéro 2, suivez un Beech 200 en vent arrière, rappelez finale',
    teaching:
      "H-JN est n°1 en vent arrière. F-RK devient n°2. On donne le suivez et on demande le rappel finale.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 230, y: 89, label: 'H-JN', heading: 90 },
      { id: 'F-RK', type: 'arrival', x: 340, y: 89, label: 'F-RK', heading: 90 },
      { id: 'D-KW', type: 'transit', x: 500, y: 89, label: 'D-KW', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 54,
    time: '16:42:40',
    speaker: { role: 'PILOTE', callsign: 'H-JN', color: 'arrival' },
    message: 'H-JN, final runway 27',
    expectedResponse: 'H-JN, runway 27 cleared to land, wind 250°/10kt',
    teaching:
      "H-JN rappelle finale. Piste libre → clairance atterrissage en anglais. La piste est occupée dès cet instant.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 590, y: 131, label: 'H-JN', heading: 270 },
      { id: 'F-RK', type: 'arrival', x: 180, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 55,
    time: '16:42:50',
    speaker: { role: 'PILOTE', callsign: 'F-MS', color: 'departure' },
    message: 'F-MS, prêt à remonter piste 27',
    expectedResponse: 'F-MS, maintenez avant point d\'attente piste 27, Beech 200 en finale, rappelez en vue — puis : F-RK, prolongez vent arrière, avion en attente de remonter piste 27',
    teaching:
      "H-JN est en finale → verrou actif pour remontée. Phase 1 conditionnel pour F-MS : maintien + rappelez en vue. Simultanément, faire allonger F-RK (vent arrière n°2) pour lui dégager la finale après que F-MS aura décollé.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 560, y: 131, label: 'H-JN', heading: 270 },
      { id: 'F-RK', type: 'arrival', x: 155, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 56,
    time: '16:43:00',
    speaker: { role: 'PILOTE', callsign: 'F-MS', color: 'departure' },
    message: 'Beech 200 en vue, F-MS',
    expectedResponse: 'F-MS, derrière le Beech 200 en finale, remontez piste 27, alignez-vous et attendez derrière',
    teaching:
      "F-MS a le visuel sur H-JN → phase 2 de l'alignement conditionnel. F-MS entre sur la piste derrière H-JN et attend la clairance décollage.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 520, y: 131, label: 'H-JN', heading: 270 },
      { id: 'F-RK', type: 'arrival', x: 140, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 373, y: 162, label: 'F-MS', heading: 0 },
    ],
  },
  {
    id: 57,
    time: '16:43:40',
    speaker: { role: 'PILOTE', callsign: 'H-JN', color: 'arrival' },
    message: 'H-JN, apron to leave frequency',
    expectedResponse: 'H-JN, roger, good day',
    teaching:
      "H-JN a atterri, dégage et annonce quitter la fréquence depuis l'aire de trafic. Strip archivé.",
    aircraft: [
      { id: 'H-JN', type: 'arrival', x: 373, y: 178, label: 'H-JN', heading: 180 },
      { id: 'F-RK', type: 'arrival', x: 130, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 540, y: 131, label: 'F-MS', heading: 270 },
    ],
  },
  {
    id: 58,
    time: '16:44:10',
    speaker: { role: 'PILOTE', callsign: 'D-KW', color: 'transit' },
    message: 'D-KW, MORGON, leaving frequency, good day',
    expectedResponse: 'D-KW, roger, good day',
    teaching:
      "D-KW passe Morgon et quitte la fréquence. Strip transit archivé.",
    aircraft: [
      { id: 'F-RK', type: 'arrival', x: 130, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 615, y: 131, label: 'F-MS', heading: 270 },
    ],
  },
  {
    id: 59,
    time: '16:45:10',
    speaker: { role: 'PILOTE', callsign: 'F-MS', color: 'departure' },
    message: 'F-MS, prêt au départ',
    expectedResponse: 'F-MS, piste 27 autorisé décollage, vent 250°/10kt',
    teaching:
      "H-JN a dégagé, piste libre. F-RK est en vent arrière étendu (suffisamment loin). Clairance décollage pour F-MS. Surveiller l'extrémité de piste pour l'autorisation d'atterrissage à F-RK.",
    aircraft: [
      { id: 'F-RK', type: 'arrival', x: 130, y: 89, label: 'F-RK', heading: 90 },
      { id: 'F-MS', type: 'departure', x: 615, y: 131, label: 'F-MS', heading: 270 },
    ],
    showPattern: true,
  },
  {
    id: 60,
    time: '16:45:30',
    speaker: { role: 'PILOTE', callsign: 'F-RK', color: 'arrival' },
    message: 'F-RK, finale piste 27, pour un atterrissage court',
    expectedResponse: null,
    teaching:
      "F-RK rappelle finale. F-MS est encore en roulement ou vient de décoller mais n'a PAS encore franchi l'extrémité de piste → ne pas donner la clairance atterrissage maintenant. Attendre que F-MS franchisse l'extrémité.",
    aircraft: [
      { id: 'F-RK', type: 'arrival', x: 590, y: 131, label: 'F-RK', heading: 270 },
      { id: 'F-MS', type: 'departure', x: 200, y: 131, label: 'F-MS', heading: 270 },
    ],
  },
  {
    id: 61,
    time: '16:46:00',
    speaker: { role: 'INFO' },
    message: "F-MS franchit l'extrémité de piste (seuil 09) et amorce son virage. F-RK est en courte finale. Piste libre.",
    expectedResponse: 'F-RK, numéro 1, piste 27 autorisé atterrissage, vent 250°/10kt',
    teaching:
      "Dès que F-MS franchit l'extrémité de piste, la piste est libre et on autorise F-RK. Report courte finale : F-RK était en finale courte — la clairance était retenue jusqu'ici pour s'assurer que F-MS avait bien dégagé. Fin du scénario.",
    aircraft: [
      { id: 'F-RK', type: 'arrival', x: 560, y: 131, label: 'F-RK', heading: 270 },
      { id: 'F-MS', type: 'departure', x: 80, y: 120, label: 'F-MS', heading: 270 },
    ],
  },
];


const SCENARIO_4_STEPS = [
  {
    id: 1,
    time: '07:00:00',
    speaker: { role: 'INFO' },
    message:
      "Situation initiale. Piste 09 en service, vent 080°/10 kt, QNH 1020. Circuit main gauche piste 09, au nord du terrain. F-MY (C172) approche de Lille via Saint-Amour (NW), estimé dans 4 minutes.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-MY', type: 'arrival', x: 50, y: 20, label: 'F-MY', heading: 135 },
    ],
  },
  {
    id: 2,
    time: '07:00:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'departure' },
    message: 'AURIOL Tour, FBVHC, Cessna 172, poste C2, VFR pour Dôle via Saint-Amour, demande roulage',
    expectedResponse: "FBVHC, piste 09 en service, vent 080°/10 kt, QNH 1020, roulez point d'attente piste 09",
    teaching:
      "Première communication — callsign complet FBVHC. Départ vers Dôle via Saint-Amour (NW). Strip rouge. Piste 09 en service (sens inversé par rapport à la piste 27).",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 380, y: 245, label: 'F-HC', heading: 0 },
      { id: 'F-MY', type: 'arrival', x: 80, y: 35, label: 'F-MY', heading: 135 },
    ],
  },
  {
    id: 3,
    time: '07:00:00',
    speaker: { role: 'PILOTE', callsign: 'F-MY', color: 'arrival' },
    message: 'AURIOL Tour, FGCMY, Cessna 172, de Lille via Saint-Amour, aérodrome estimé dans 4 minutes, pour atterrissage',
    expectedResponse: 'FGCMY, piste 09 en service, vent 080°/10 kt, QNH 1020, entrez vent arrière main gauche piste 09, rappelez vent arrière',
    teaching:
      "F-MY arrive de Saint-Amour (NW) — côté correct pour le circuit main gauche piste 09. Intégration directe en vent arrière, sans vertical tour. Strip bleu.",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 380, y: 245, label: 'F-HC', heading: 0 },
      { id: 'F-MY', type: 'arrival', x: 110, y: 50, label: 'F-MY', heading: 135 },
    ],
  },
  {
    id: 4,
    time: '07:01:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'AURIOL Tower, GBXKZ, DR400, stand A3, request taxi for runway circuits',
    expectedResponse: "GBXKZ, runway 09 in use, wind 080°/10 kt, QNH 1020, follow the Cessna 172 to holding point runway 09",
    teaching:
      "G-KZ demande un tour de piste. On lui demande de suivre F-HC (C172 déjà en roulage) vers le point d'attente. Strip rouge+bleu (TdP). Réponse en anglais (pilote anglophone).",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 295, y: 245, label: 'F-HC', heading: 0 },
      { id: 'G-KZ', type: 'circuit', x: 380, y: 245, label: 'G-KZ', heading: 0 },
      { id: 'F-MY', type: 'arrival', x: 150, y: 65, label: 'F-MY', heading: 135 },
    ],
  },
  {
    id: 5,
    time: '07:02:00',
    speaker: { role: 'SECU', callsign: 'FLYCO', color: 'vehicle' },
    message: 'AURIOL Tour, Flyco, demande à procéder de la tour au local technique',
    expectedResponse: "Flyco, procédez au point d'attente intersection H2",
    teaching:
      "F-HC et G-KZ roulent vers le point d'attente. Flyco demande à traverser via H2 — conflit de roulage potentiel. On l'envoie au point d'attente H2 pour laisser passer les avions.",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 200, y: 245, label: 'F-HC', heading: 0 },
      { id: 'G-KZ', type: 'circuit', x: 295, y: 245, label: 'G-KZ', heading: 0 },
      { id: 'F-MY', type: 'arrival', x: 185, y: 80, label: 'F-MY', heading: 135 },
      { id: 'FLYCO', type: 'vehicle', x: 515, y: 215, label: 'FLYCO' },
    ],
  },
  {
    id: 6,
    time: '07:03:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'departure' },
    message: 'F-HC, prêt au départ',
    expectedResponse:
      'F-HC, trafic de Saint-Amour vers vent arrière, Cessna 172, piste 09 autorisé décollage, vent 080°/10 kt, rappelez vent arrière main gauche piste 09 — puis : F-MY, trafic au départ vers Saint-Amour, Cessna 172',
    teaching:
      "F-HC part vers Saint-Amour (NW) et F-MY arrive de Saint-Amour (NW) : leurs trajectoires se croisent au NW. Info trafic réciproque obligatoire. G-KZ attend au point d'attente — pas encore de conflit.",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 100, y: 132, label: 'F-HC', heading: 90 },
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 215, y: 90, label: 'F-MY', heading: 90 },
      { id: 'FLYCO', type: 'vehicle', x: 440, y: 180, label: 'FLYCO' },
    ],
  },
  {
    id: 7,
    time: '07:04:00',
    speaker: { role: 'INFO' },
    message:
      "F-HC a dépassé le seuil de piste. Flyco est au point d'attente H2. G-KZ a dépassé l'intersection J1. La piste est libre — Flyco peut traverser.",
    expectedResponse: 'Flyco, traversez piste 09, rappelez piste dégagée',
    teaching:
      "Dès que F-HC franchit l'extrémité de piste 09, la piste est libre. Flyco peut traverser. G-KZ est arrêté avant J1 — pas de conflit.",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 350, y: 110, label: 'F-HC', heading: 90 },
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 290, y: 95, label: 'F-MY', heading: 90 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 158, label: 'FLYCO' },
    ],
  },
  {
    id: 8,
    time: '07:04:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message:
      'AURIOL Tour, FGDLN, Piper Cherokee, provenance Avignon via Morgon, aérodrome estimé dans 4 minutes, pour atterrissage',
    expectedResponse:
      'FGDLN, piste 09 en service, vent 080°/10 kt, QNH 1020, entrez vent arrière main gauche piste 09 via vertical tour, rappelez vertical tour',
    teaching:
      "F-LN arrive du Sud via Morgon — vertical tour obligatoire pour toute arrivée du Sud. Circuit main gauche piste 09 : vertical puis vent arrière à l'Ouest. Strip bleu.",
    aircraft: [
      { id: 'F-HC', type: 'departure', x: 400, y: 90, label: 'F-HC', heading: 315 },
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 350, y: 95, label: 'F-MY', heading: 270 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 132, label: 'FLYCO' },
      { id: 'F-LN', type: 'arrival', x: 370, y: 390, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 9,
    time: '07:06:00',
    speaker: { role: 'SECU', callsign: 'FLYCO', color: 'vehicle' },
    message: 'Flyco, piste dégagée, pour quitter la fréquence',
    expectedResponse: 'Flyco, roger, au revoir',
    teaching:
      "Flyco a traversé la piste 09 et rejoint le local technique. Accusé de réception. Strip archivé.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 430, y: 95, label: 'F-MY', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 320, label: 'F-LN', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 95, label: 'FLYCO' },
    ],
  },
  {
    id: 10,
    time: '07:08:00',
    speaker: { role: 'PILOTE', callsign: 'F-MY', color: 'arrival' },
    message: 'F-MY, vent arrière',
    expectedResponse: 'F-MY, numéro 1, rappelez finale',
    teaching:
      "F-MY entre en vent arrière main gauche piste 09 (heading Ouest, au nord du terrain). Seul dans le circuit — numéro 1, rappel finale.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 150, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 500, y: 95, label: 'F-MY', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 11,
    time: '07:08:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vertical tour',
    expectedResponse:
      'F-LN, trafic au départ vers Saint-Amour, Cessna 172, rappelez vent arrière — puis : F-HC, trafic de vertical tour vers vent arrière, Piper Cherokee',
    teaching:
      "F-LN passe la verticale tour. F-HC part en direction de Saint-Amour (NW) : leurs trajectoires se croisent dans le secteur NW. Info trafic dans les deux sens (livret 4). F-HC est toujours en fréquence.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 260, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-MY', type: 'arrival', x: 410, y: 95, label: 'F-MY', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 370, y: 260, label: 'F-LN', heading: 0 },
      { id: 'F-HC', type: 'departure', x: 200, y: 55, label: 'F-HC', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 12,
    time: '07:09:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, right hand downwind runway 09',
    expectedResponse: 'G-KZ, number 2, follow a Cessna 172 on downwind, report final',
    teaching:
      "G-KZ entre en vent arrière derrière F-MY (C172, n°1). Séquencement : n°2, suivre le C172 visuellement. Rappel finale. Réponse en anglais.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 560, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 330, y: 95, label: 'F-MY', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 320, y: 200, label: 'F-LN', heading: 315 },
      { id: 'F-HC', type: 'departure', x: 100, y: 35, label: 'F-HC', heading: 315 },
    ],
    showPattern: true,
  },
  {
    id: 13,
    time: '07:10:00',
    speaker: { role: 'PILOTE', callsign: 'F-MY', color: 'arrival' },
    message: 'F-MY, finale piste 09',
    expectedResponse: 'F-MY, piste 09 autorisé atterrissage, vent 080°/10 kt',
    teaching:
      "F-MY n°1 en finale piste 09 (heading Est, approche de l'Ouest). G-KZ est en vent arrière. Piste libre. Clairance atterrissage.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 460, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 30, y: 132, label: 'F-MY', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 240, y: 155, label: 'F-LN', heading: 315 },
    ],
  },
  {
    id: 14,
    time: '07:11:00',
    speaker: { role: 'INFO' },
    message:
      "F-MY (C172, n°1) vient de toucher les roues — heure d'atterrissage notée. G-KZ (DR400) est en vent arrière et était n°2. C'est le moment d'actualiser le numéro d'ordre.",
    expectedResponse: 'G-KZ, number 1, report final',
    teaching:
      "L'avion n°1 perd son numéro au toucher des roues. Actualisation proactive (livret 4, §8) : G-KZ devient n°1 sans attendre son prochain rappel.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 350, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 250, y: 132, label: 'F-MY', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 160, y: 132, label: 'F-LN', heading: 270 },
    ],
    showPattern: true,
  },
  {
    id: 15,
    time: '07:12:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, vent arrière main gauche piste 09',
    expectedResponse: 'F-LN, numéro 2, suivez un DR400 en vent arrière, rappelez finale',
    teaching:
      "F-LN entre en vent arrière après avoir passé le vertical. G-KZ (DR400, n°1) est devant elle. Séquencement : n°2, suivre le DR400 visuellement.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 265, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 510, y: 95, label: 'F-LN', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 345, y: 245, label: 'F-MY', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 16,
    time: '07:13:00',
    speaker: { role: 'PILOTE', callsign: 'F-HC', color: 'departure' },
    message: 'F-HC, je quitte la fréquence, au revoir',
    expectedResponse: 'F-HC, roger, au revoir',
    teaching:
      "F-HC (C172) quitte la zone vers Dôle. Heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 185, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 430, y: 95, label: 'F-LN', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 345, y: 245, label: 'F-MY', heading: 0 },
      { id: 'F-HC', type: 'departure', x: 25, y: 20, label: 'F-HC', heading: 315 },
    ],
  },
  {
    id: 17,
    time: '07:14:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, final runway 09',
    expectedResponse: 'G-KZ, runway 09 cleared to land, wind 080°/10 kt',
    teaching:
      "G-KZ n°1 en finale piste 09. F-LN est en vent arrière (n°2). Piste libre. Clairance atterrissage. Réponse en anglais.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 30, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 310, y: 95, label: 'F-LN', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 345, y: 245, label: 'F-MY', heading: 0 },
    ],
  },
  {
    id: 18,
    time: '07:14:30',
    speaker: { role: 'PILOTE', callsign: 'F-MY', color: 'arrival' },
    message: 'F-MY, au parking, pour quitter la fréquence',
    expectedResponse: 'F-MY, roger, au revoir',
    teaching:
      "F-MY (C172) est garée au parking aéroclub. Accusé de réception. Strip archivé.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 30, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 260, y: 95, label: 'F-LN', heading: 270 },
      { id: 'F-MY', type: 'arrival', x: 345, y: 245, label: 'F-MY', heading: 0 },
    ],
  },
  {
    id: 19,
    time: '07:15:00',
    speaker: { role: 'INFO' },
    message:
      "G-KZ (DR400) vient d'atterrir et dégage la piste. F-LN (PA28) est en vent arrière. C'est le moment d'actualiser le numéro d'ordre et de préparer le départ de G-KZ (TdP).",
    expectedResponse: 'F-LN, numéro 1, rappelez finale',
    teaching:
      "G-KZ atterrit — F-LN devient n°1 au toucher des roues. Actualisation immédiate sans attendre le rappel de F-LN.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 250, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 175, y: 95, label: 'F-LN', heading: 270 },
    ],
    showPattern: true,
  },
  {
    id: 20,
    time: '07:16:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, clear of runway, request taxi for another circuit',
    expectedResponse:
      "G-KZ, hold short of holding point runway 09, Piper Cherokee on final, report in sight",
    teaching:
      "G-KZ dégage la piste et veut refaire un tour de piste. F-LN est en finale — verrou de piste. On maintient G-KZ au point d'attente et on lui demande de rappeler en vue du Cherokee. C'est l'alignement conditionnel (livret 5).",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 80, y: 132, label: 'F-LN', heading: 90 },
    ],
  },
  {
    id: 21,
    time: '07:16:30',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, traffic in sight',
    expectedResponse: 'G-KZ, behind the Piper Cherokee on final, line up and wait runway 09 behind',
    teaching:
      "G-KZ a le Cherokee en vue. Alignement conditionnel : G-KZ peut s'aligner derrière F-LN qui est en finale. Dès que F-LN dégage la piste, on donnera la clairance décollage à G-KZ.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 75, y: 170, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 50, y: 132, label: 'F-LN', heading: 90 },
    ],
  },
  {
    id: 22,
    time: '07:17:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, finale piste 09',
    expectedResponse: 'F-LN, piste 09 autorisé atterrissage, vent 080°/10 kt',
    teaching:
      "F-LN n°1 en finale. G-KZ est aligné derrière en attente (alignement conditionnel). Piste libre. Clairance atterrissage pour F-LN.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 100, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 30, y: 132, label: 'F-LN', heading: 90 },
    ],
  },
  {
    id: 23,
    time: '07:18:00',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, piste dégagée, demande roulage parking',
    expectedResponse:
      'G-KZ, runway 09 cleared for take-off, wind 080°/10 kt, report downwind — puis : F-LN, roulez poste A4',
    teaching:
      "F-LN dégage la piste : G-KZ peut décoller immédiatement (il est déjà aligné). On clairances G-KZ en priorité (sur la piste), puis on répond à F-LN. Deux transmissions enchaînées.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 200, y: 132, label: 'G-KZ', heading: 90 },
      { id: 'F-LN', type: 'arrival', x: 300, y: 175, label: 'F-LN', heading: 180 },
    ],
  },
  {
    id: 24,
    time: '07:19:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, right hand downwind runway 09',
    expectedResponse: 'G-KZ, number 1, report final',
    teaching:
      "G-KZ entre en vent arrière pour son second tour. Seul dans le circuit — n°1, rappel finale.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 490, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 295, y: 245, label: 'F-LN', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 25,
    time: '07:19:30',
    speaker: { role: 'PILOTE', callsign: 'F-LN', color: 'arrival' },
    message: 'F-LN, au parking, pour quitter la fréquence',
    expectedResponse: 'F-LN, roger, au revoir',
    teaching:
      "F-LN (PA28) est garée au poste A4. Accusé de réception. Strip archivé.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 390, y: 95, label: 'G-KZ', heading: 270 },
      { id: 'F-LN', type: 'arrival', x: 295, y: 245, label: 'F-LN', heading: 0 },
    ],
  },
  {
    id: 26,
    time: '07:21:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, final runway 09',
    expectedResponse: 'G-KZ, runway 09 cleared to land, wind 080°/10 kt',
    teaching:
      "G-KZ n°1 en finale, circuit complet effectué. Piste libre. Clairance atterrissage.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 30, y: 132, label: 'G-KZ', heading: 90 },
    ],
  },
  {
    id: 27,
    time: '07:22:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, clear of runway, request taxi',
    expectedResponse: 'G-KZ, taxi parking aéroclub',
    teaching:
      "G-KZ dégage la piste après son tour de piste. Roulage au parking aéroclub (parking D, non visible depuis la tour). Strip archivé sous la barrette.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 260, y: 175, label: 'G-KZ', heading: 90 },
    ],
  },
  {
    id: 28,
    time: '07:23:00',
    speaker: { role: 'PILOTE', callsign: 'G-KZ', color: 'circuit' },
    message: 'G-KZ, leaving frequency, goodbye',
    expectedResponse: 'G-KZ, roger, goodbye',
    teaching:
      "G-KZ (DR400) a accompli ses tours de piste. Strip archivé avec heure de dernier contact. Fréquence calme.",
    aircraft: [
      { id: 'G-KZ', type: 'circuit', x: 350, y: 245, label: 'G-KZ', heading: 0 },
    ],
  },
];


const SCENARIO_5_STEPS = [
  {
    id: 1,
    time: '09:30:00',
    speaker: { role: 'INFO' },
    message:
      "Situation initiale. Piste 27 en service, vent 250°/12 kt, QNH 1015. Un strip IFR (fond orange) est sur le tableau d'attente : F-HI (Piper Cheyenne, FBMHI), ETD 09h45, destination Cannes. G-RE (DR400) et G-AS (TBM700 transit Julienas→Fleurie) vont appeler sous peu.",
    expectedResponse: null,
    teaching: null,
    aircraft: [],
  },
  {
    id: 2,
    time: '09:31:00',
    speaker: { role: 'PILOTE', callsign: 'F-HI', color: 'departure' },
    message: 'AURIOL Tour, FBMHI, Piper Cheyenne, poste B2, IFR destination Cannes, demande mise en route, heure estimée de départ, 45',
    expectedResponse: 'F-HI, roger, je vous rappelle',
    teaching:
      "Départ IFR : le pilote donne callsign complet, type, poste, destination et ETD. La réponse obligatoire est 'roger, je vous rappelle' — le contrôleur doit appeler BASTIÉ AVANT de répondre au pilote.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
    ],
  },
  {
    id: 3,
    time: '09:31:30',
    speaker: { role: 'INFO' },
    message:
      "Le contrôleur appelle BASTIÉ : « Bonjour, AURIOL Tour, demande mise en route IFR, FBMHI, Piper Cheyenne, destination LFMD (Cannes), départ prévu 09h45. » BASTIÉ répond : « Mise en route approuvée FBMHI pour 09h45, rappelez-moi pour la clairance. »",
    expectedResponse:
      'F-HI, mise en route approuvée pour un départ à 09h45, piste 27 en service, vent 250°/12 kt, QNH 1015, rappelez prêt à rouler',
    teaching:
      "Coordination BASTIÉ (livret 5, §1) : 1. Appel BASTIÉ avec callsign + type + destination + ETD. 2. BASTIÉ approuve. 3. Transmission au pilote : mise en route approuvée + piste + vent + QNH + 'rappelez prêt à rouler'.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
    ],
  },
  {
    id: 4,
    time: '09:32:00',
    speaker: { role: 'PILOTE', callsign: 'G-RE', color: 'departure' },
    message: 'AURIOL Tower, GBTRE, DR400, stand C3, VFR on flight plan, destination Toussus-le-Noble via Julienas, request taxi',
    expectedResponse: 'GBTRE, runway 27 in use, wind 250°/12 kt, QNH 1015, taxi holding point runway 27',
    teaching:
      "Première communication — callsign complet GBTRE. Départ VFR avec plan de vol (PLN). Poste C3, pas de conflit. QNH 1015 transmis — attention au collationnement du pilote. Réponse en anglais.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
      { id: 'G-RE', type: 'departure', x: 405, y: 245, label: 'G-RE', heading: 0 },
    ],
  },
  {
    id: 5,
    time: '09:32:10',
    speaker: { role: 'PILOTE', callsign: 'G-RE', color: 'departure' },
    message: "Runway 27, QNH 1001, taxi holding point runway 27, G-RE",
    expectedResponse: 'G-RE, negative, QNH 1015',
    teaching:
      "Mauvais collationnement : G-RE a répété QNH 1001 au lieu de QNH 1015. Correction immédiate obligatoire : 'négatif' + valeur correcte. Une erreur de QNH génère une erreur d'altitude.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
      { id: 'G-RE', type: 'departure', x: 405, y: 245, label: 'G-RE', heading: 0 },
    ],
  },
  {
    id: 6,
    time: '09:33:00',
    speaker: { role: 'SECU', callsign: 'FLYCO', color: 'vehicle' },
    message: 'AURIOL Tour, Flyco, demande à procéder de la tour vers le local technique',
    expectedResponse: "Flyco, suivez le DR400 au roulage vers le point d'attente piste 27",
    teaching:
      "Flyco veut rejoindre le local technique. G-RE roule vers H2 sur le même chemin. On évite le conflit : Flyco suit le DR400 jusqu'au point d'attente, puis traversera la piste une fois G-RE dégagé.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
      { id: 'G-RE', type: 'departure', x: 373, y: 210, label: 'G-RE', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 515, y: 215, label: 'FLYCO' },
    ],
  },
  {
    id: 7,
    time: '09:34:00',
    speaker: { role: 'PILOTE', callsign: 'G-AS', color: 'transit' },
    message:
      'AURIOL Tower, GBXAS, TBM700, from Julienas, 2500 ft QNH, over airfield estimated at 40, exit via Fleurie',
    expectedResponse: 'GBXAS, runway 27 in use, QNH 1015, report overhead airfield',
    teaching:
      "Transit VFR : piste en service + QNH uniquement (pas de vent). G-AS est à 2500ft, circuit à 1400ft — pas de conflit altitude. 'Report overhead airfield' (livret transit). Réponse en anglais.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 245, label: 'F-HI', heading: 0 },
      { id: 'G-RE', type: 'departure', x: 373, y: 185, label: 'G-RE', heading: 0 },
      { id: 'G-AS', type: 'transit', x: 100, y: 25, label: 'G-AS', heading: 135 },
      { id: 'FLYCO', type: 'vehicle', x: 460, y: 195, label: 'FLYCO' },
    ],
  },
  {
    id: 8,
    time: '09:35:00',
    speaker: { role: 'PILOTE', callsign: 'F-HI', color: 'departure' },
    message: 'F-HI, demande roulage',
    expectedResponse:
      "F-HI, roulez point d'attente piste 27, je vous rappelle pour la clairance",
    teaching:
      "F-HI est prête à rouler. Clairance roulage standard. La formule 'je vous rappelle pour la clairance' signale au pilote de ne pas attendre la clairance IFR maintenant. Le contrôleur appelle BASTIÉ dès que F-HI roule.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 345, y: 215, label: 'F-HI', heading: 0 },
      { id: 'G-RE', type: 'departure', x: 373, y: 158, label: 'G-RE', heading: 0 },
      { id: 'G-AS', type: 'transit', x: 240, y: 65, label: 'G-AS', heading: 135 },
      { id: 'FLYCO', type: 'vehicle', x: 400, y: 175, label: 'FLYCO' },
    ],
  },
  {
    id: 9,
    time: '09:36:00',
    speaker: { role: 'PILOTE', callsign: 'G-RE', color: 'departure' },
    message: 'G-RE, ready for departure from the intersection',
    expectedResponse:
      'G-RE, traffic from Julienas to Fleurie, TBM700, line up runway 27, cleared for take-off, wind 250°/12 kt — puis : G-AS, traffic departing to Julienas, DR400',
    teaching:
      "G-RE part vers Toussus via Julienas (NW). G-AS (TBM700) transite de Julienas vers Fleurie — trajectoires croisées dans le secteur NW. Info trafic dans les deux sens. G-RE clairé départ depuis l'intersection H2 (TORA 500m). Réponse en anglais.",
    aircraft: [
      { id: 'G-RE', type: 'departure', x: 373, y: 158, label: 'G-RE', heading: 0 },
      { id: 'G-AS', type: 'transit', x: 350, y: 115, label: 'G-AS', heading: 135 },
      { id: 'F-HI', type: 'departure', x: 373, y: 190, label: 'F-HI', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 158, label: 'FLYCO' },
    ],
  },
  {
    id: 10,
    time: '09:36:30',
    speaker: { role: 'INFO' },
    message:
      "G-RE (DR400) vient de décoller. Le contrôleur doit maintenant activer le plan de vol VFR auprès du BNIA : « Bonjour, AURIOL Tour, demande activation plan de vol, G-RE, destination Toussus-le-Noble, départ 09h36. »",
    expectedResponse: null,
    teaching:
      "Activation PLN VFR (livret 5, §2) : après le décollage d'un avion avec plan de vol VFR, le contrôleur informe le BNIA pour activer le plan de vol et déclencher le service d'alerte.",
    aircraft: [
      { id: 'G-RE', type: 'departure', x: 200, y: 132, label: 'G-RE', heading: 270 },
      { id: 'G-AS', type: 'transit', x: 400, y: 175, label: 'G-AS', heading: 135 },
      { id: 'F-HI', type: 'departure', x: 373, y: 175, label: 'F-HI', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 158, label: 'FLYCO' },
    ],
  },
  {
    id: 11,
    time: '09:37:00',
    speaker: { role: 'SECU', callsign: 'FLYCO', color: 'vehicle' },
    message: 'Flyco, demande traversée piste 27',
    expectedResponse: 'Flyco, traversez piste 27',
    teaching:
      "G-RE vient de décoller et a dépassé l'extrémité de piste. F-HI roule toujours vers le point d'attente — il n'a pas encore atteint la piste. Traversée autorisée pour Flyco.",
    aircraft: [
      { id: 'G-RE', type: 'departure', x: 90, y: 110, label: 'G-RE', heading: 270 },
      { id: 'G-AS', type: 'transit', x: 435, y: 215, label: 'G-AS', heading: 135 },
      { id: 'F-HI', type: 'departure', x: 373, y: 175, label: 'F-HI', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 158, label: 'FLYCO' },
    ],
  },
  {
    id: 12,
    time: '09:38:00',
    speaker: { role: 'PILOTE', callsign: 'G-AS', color: 'transit' },
    message: 'G-AS, overhead airfield',
    expectedResponse: 'G-AS, report leaving frequency',
    teaching:
      "G-AS (TBM700) passe la verticale aérodrome à 2500ft. Pour un transit, la réponse au vertical est 'report leaving frequency' (ou 'rappelez quittant la fréquence') : on garde le contact jusqu'à ce que l'avion sorte de la zone.",
    aircraft: [
      { id: 'G-AS', type: 'transit', x: 370, y: 260, label: 'G-AS', heading: 180 },
      { id: 'F-HI', type: 'departure', x: 373, y: 158, label: 'F-HI', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 100, label: 'FLYCO' },
    ],
  },
  {
    id: 13,
    time: '09:38:30',
    speaker: { role: 'INFO' },
    message:
      "F-HI est au point d'attente. Le contrôleur rappelle BASTIÉ pour la clairance IFR : « AURIOL Tour, demande clairance départ IFR, FBMHI. » BASTIÉ répond : « FBMHI : BST, 5000 pieds QNH 1015, transpondeur 1878, BASTIÉ Approche 136.080. »",
    expectedResponse:
      'F-HI, rappelez prête à copier la clairance',
    teaching:
      "Le contrôleur ne transmet pas la clairance d'emblée : il demande d'abord au pilote s'il est prêt à copier ('rappelez prête à copier'). Cela évite de transmettre une longue clairance à un pilote non prêt.",
    aircraft: [
      { id: 'G-AS', type: 'transit', x: 430, y: 330, label: 'G-AS', heading: 180 },
      { id: 'F-HI', type: 'departure', x: 373, y: 158, label: 'F-HI', heading: 0 },
      { id: 'FLYCO', type: 'vehicle', x: 373, y: 95, label: 'FLYCO' },
    ],
  },
  {
    id: 14,
    time: '09:39:00',
    speaker: { role: 'PILOTE', callsign: 'F-HI', color: 'departure' },
    message: 'F-HI, prête à copier',
    expectedResponse:
      'F-HI, rejoignez BST, 5000 pieds QNH 1015, transpondeur 1878, BASTIÉ Approche en standby 136.080',
    teaching:
      "Clairance IFR transmise élément par élément : balise de sortie (BST), niveau (5000ft QNH), squawk (1878), fréquence suivante (BASTIÉ 136.080). Chaque élément collationnement par le pilote est souligné sur le strip.",
    aircraft: [
      { id: 'G-AS', type: 'transit', x: 490, y: 400, label: 'G-AS', heading: 180 },
      { id: 'F-HI', type: 'departure', x: 373, y: 158, label: 'F-HI', heading: 0 },
    ],
  },
  {
    id: 15,
    time: '09:39:30',
    speaker: { role: 'PILOTE', callsign: 'G-AS', color: 'transit' },
    message: 'G-AS, leaving frequency, good day',
    expectedResponse: 'G-AS, roger, goodbye',
    teaching:
      "G-AS quitte la fréquence vers Fleurie. Accusé de réception sobre. Strip transit archivé.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 373, y: 158, label: 'F-HI', heading: 0 },
      { id: 'G-AS', type: 'transit', x: 550, y: 430, label: 'G-AS', heading: 180 },
    ],
  },
  {
    id: 16,
    time: '09:40:00',
    speaker: { role: 'SECU', callsign: 'FLYCO', color: 'vehicle' },
    message: 'Flyco, piste dégagée, pour quitter la fréquence',
    expectedResponse: 'Flyco, roger, au revoir',
    teaching:
      "Flyco a traversé la piste 27 et rejoint le local technique. Accusé de réception. Strip archivé.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 373, y: 158, label: 'F-HI', heading: 0 },
    ],
  },
  {
    id: 17,
    time: '09:41:00',
    speaker: { role: 'PILOTE', callsign: 'F-HI', color: 'departure' },
    message: 'F-HI, correct, prête au départ, demande remontée piste 27',
    expectedResponse:
      'F-HI, remontez piste 27, alignez-vous, piste 27 autorisé décollage, vent 250°/12 kt',
    teaching:
      "'Correct' confirme le collationnement intégral de la clairance IFR. Piste libre, finale libre. Clairance remontée + alignement + décollage en une seule transmission.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 615, y: 132, label: 'F-HI', heading: 270 },
    ],
  },
  {
    id: 18,
    time: '09:42:00',
    speaker: { role: 'PILOTE', callsign: 'F-HI', color: 'departure' },
    message: 'F-HI, je quitte la fréquence, bonjour BASTIÉ',
    expectedResponse: 'F-HI, roger, au revoir',
    teaching:
      "F-HI (Piper Cheyenne IFR) quitte la fréquence TWR pour contacter BASTIÉ Approche (136.080). Strip archivé avec heure de décollage — l'heure de décollage est obligatoire pour le service d'alerte IFR.",
    aircraft: [
      { id: 'F-HI', type: 'departure', x: 480, y: 80, label: 'F-HI', heading: 315 },
    ],
  },
];

const SCENARIOS = [
  {
    id: 'scenario_1',
    title: 'Scénario de @alextoledozo sur instagram ~ 10 min',
    description:
      "Scénario long combinant approche directe, laissez-passer, backtrack, remise de gaz, tour de piste, transit et verrou de piste. Pilotes anglais et français.",
    color: '#8b5cf6',
    icon: 'layers',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_1_STEPS,
  },
  {
    id: 'scenario_2',
    title: '@alextoledozo version pro max revue et augmentée ~ 30 min',
    description:
      "Suite directe du scénario 1. Situations variées inspirées des livrets BASIC TWR.",
    color: '#3b82f6',
    icon: 'layers',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_2_STEPS,
  },
  {
    id: 'scenario_3',
    title: 'Simu sombre de Sonia datant de 2006 remis au goût du jour',
    description:
      "Roulages conflictuels (véhicule, arrivée/départ), info réciproque intersection, changement QNH, mauvais collationnement, alignements conditionnels avec allongement vent arrière, courte finale.",
    color: '#10b981',
    icon: 'layers',
    official: true,
    setup: { wind: '250°/10 kt', qnh: '1009→1010', rwy: '27' },
    steps: SCENARIO_3_STEPS,
  },
  {
    id: 'scenario_4',
    title: 'Simu Mehiti',
    description:
      "Piste 09 en service (sens inversé). Arrivée du Sud via Morgon (vertical tour obligatoire), tour de piste anglophone, roulage conflictuel véhicule, alignement conditionnel.",
    color: '#f59e0b',
    icon: 'layers',
    official: true,
    setup: { wind: '080°/10 kt', qnh: '1020', rwy: '09' },
    steps: SCENARIO_4_STEPS,
  },
  {
    id: 'scenario_5',
    title: 'Simu Anna',
    description:
      "Départ IFR avec coordination BASTIÉ, départ VFR avec plan de vol et mauvais collationnement QNH, transit TBM700, roulage véhicule.",
    color: '#ef4444',
    icon: 'layers',
    official: true,
    setup: { wind: '250°/12 kt', qnh: '1015', rwy: '27' },
    steps: SCENARIO_5_STEPS,
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

        <div className="grid grid-cols-1 gap-5">
          {SCENARIOS.map((scenario, idx) => {
            const Icon = getIconForScenario(scenario.icon);
            return (
              <button
                key={scenario.id}
                onClick={() => onSelect(idx)}
                className="text-left bg-slate-800 border border-slate-700 rounded-xl p-7 hover:border-amber-400/40 hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center border"
                    style={{ backgroundColor: scenario.color + '20', borderColor: scenario.color + '60' }}
                  >
                    <Icon className="w-8 h-8" style={{ color: scenario.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-slate-100 truncate">{scenario.title}</h2>
                      <span
                        className="text-sm px-3 py-1 rounded-lg font-medium flex-shrink-0"
                        style={{ backgroundColor: scenario.color + '20', color: scenario.color }}
                      >
                        Scénario {idx + 1}/{SCENARIOS.length}
                      </span>
                    </div>
                    {scenario.official && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase">
                          Simulation officielle — valeur de référence
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{scenario.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono text-slate-500">
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
          <span className="text-slate-500 font-mono shrink-0">
            {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-700 ease-out"
              style={{ width: ((step + 1) / steps.length) * 100 + '%' }}
            />
          </div>
          <select
            value={step}
            onChange={(e) => {
              setStep(Number(e.target.value));
              setUserResponse('');
              setRevealed(false);
            }}
            className="shrink-0 bg-slate-800 border border-slate-600 text-slate-300 rounded px-2 py-0.5 font-mono text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {steps.map((s, i) => (
              <option key={i} value={i}>
                {String(i + 1).padStart(2, '0')} · {s.time.slice(0, 5)} · {s.speaker.role === 'INFO' ? 'INFO' : s.speaker.callsign}
              </option>
            ))}
          </select>
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

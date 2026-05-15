
import { Task, PPE } from './types';

export const PPE_LIST: PPE[] = [
  { id: 'helmet', name: 'Safety Helmet', icon: 'HardHat', checked: false },
  { id: 'gloves', name: 'Cut-Resistant Gloves', icon: 'Hand', checked: false },
  { id: 'boots', name: 'Steel-Toed Boots', icon: 'Footprints', checked: false },
  { id: 'goggles', name: 'Safety Goggles', icon: 'Eye', checked: false },
  { id: 'vest', name: 'High-Vis Vest', icon: 'Shirt', checked: false },
  { id: 'harness', name: 'Safety Harness', icon: 'Anchor', checked: false },
];

export const TASKS: Task[] = [
  { 
    id: 'welding', 
    name: 'Welding Operations', 
    requiredPPE: ['helmet', 'gloves', 'goggles', 'vest'], 
    baseRisk: 75 
  },
  { 
    id: 'height-work', 
    name: 'Working at Heights', 
    requiredPPE: ['helmet', 'boots', 'harness', 'vest'], 
    baseRisk: 90 
  },
  { 
    id: 'digging', 
    name: 'Digging Trench', 
    requiredPPE: ['helmet', 'boots', 'vest'], 
    baseRisk: 40 
  },
  { 
    id: 'electrical', 
    name: 'Electrical Maintenance', 
    requiredPPE: ['helmet', 'gloves', 'boots', 'vest'], 
    baseRisk: 85 
  },
];

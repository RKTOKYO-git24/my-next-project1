export interface PhysnaModel {
  id: string;
  name: string;
  thumbnail?: string;
  fileName?: string;
  fileType?: string;
  createdAt?: string;
  isAssembly?: boolean;
  units?: string;
  state?: string;
  geometry?: {
    surfaceArea?: number;
    modelVolume?: number;
    obbMaxLength?: number;
  };
  folder?: { name: string };
}

export interface PhysnaItem {
  id: string;
  name: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileType?: string;
  createdAt?: string;
  isAssembly?: boolean;
  units?: string;
  state?: string;
  geometry?: {
    surfaceArea?: number;
    modelVolume?: number;
    obbMaxLength?: number;
  };
  folder?: { name: string };
}

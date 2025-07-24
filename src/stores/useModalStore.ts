import type { Employee, Project } from '@/types'
import { create } from 'zustand'

type ModalType =
  | { type: 'createEmployee' }
  | { type: 'createProject' }
  | { type: 'updateEmployee'; data: Employee }
  | { type: 'updateProject'; data: Project }
  | { type: 'deleteEmployee'; data: Employee }
  | { type: 'deleteProject'; data: Project }

type ModalState = {
  isOpen: boolean
  modal: ModalType | null
  openModal: (modal: ModalType) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modal: null,
  openModal: (modal) => set({ isOpen: true, modal }),
  closeModal: () => set({ isOpen: false, modal: null }),
}))

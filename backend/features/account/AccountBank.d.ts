import { accountBankSchema } from "@/features/account/accountBank.schema"

export type BankCreateDTO = z.infer<typeof accountBankSchema>
export type BankUpdateDTO = { id: number; id_usuario: number } & Partial<Omit<BankCreateDTO, 'id' | 'id_usuario'>>

export interface BankAccountDB {
    id: number,
    nome_conta: string,
    tipo_conta: string,
    saldo: string,
    desc_conta?: string,
    icone: string,
    is_primary: boolean
}

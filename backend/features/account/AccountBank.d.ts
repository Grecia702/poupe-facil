export interface DadosBancarios {
    id?: number,
    id_usuario: number,
    nome_conta: string,
    tipo_conta: string,
    saldo: number | string,
    desc_conta?: string,
    icone: string,
    is_primary: boolean
}

export interface UserBalance<T = number> {
    saldo_total: T
    despesa: T
    receita: T
    balanco_geral: T
}

export interface UserBalanceDB<T = string> extends UserBalance<T> { };

export type ContaCreate = Omit<DadosBancarios, 'id' | 'id_usuario'>

export type ContaUpdate = { id: number; id_usuario: number } & Partial<Omit<DadosBancarios, 'id' | 'id_usuario'>>

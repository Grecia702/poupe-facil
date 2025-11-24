export interface DadosBancarios {
    id: number,
    nome_conta: string,
    tipo_conta: string,
    saldo: number,
    desc_conta?: string,
    icone: string,
    is_primary: boolean
}

export interface UserBalance {
    saldo_total: number
    despesa: number
    receita: number
    balanco_geral: number
}
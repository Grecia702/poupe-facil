const CATEGORIAS_RECEITA = {
    Salário: 'attach-money',
    Benefícios: 'card-giftcard',
    Comissão: 'trending-up',
    Rendimentos: 'savings',
    Serviços: 'build',
    Vendas: 'point-of-sale',
    Outros: 'more-horiz',
};

const CATEGORIAS_DESPESA = {
    Contas: 'credit-card',
    Alimentação: 'restaurant-menu',
    Transporte: 'directions-car',
    Internet: 'computer',
    Lazer: 'beach-access',
    Educação: 'menu-book',
    Compras: 'shopping-cart',
    Saúde: 'medication',
    Outros: 'more-horiz',
};

export const getCategoryIcon = (tipo: string, categoria: string): string => {
    const categorias = tipo === "Receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA
    if (categoria in categorias) {
        return categorias[categoria as keyof typeof categorias];
    }
    return "help-outline"
}
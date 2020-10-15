export type SymbolName = 'population' | 'metal' | 'influence' | 'ships' | 'industry'

export function symbol(name: SymbolName) {
  switch(name) {
    case 'industry': return 'I';
    case 'ships': return '►';
    case 'metal': return '■';
    case 'population': return '●';
    case 'influence': return '⦀';
  }
}
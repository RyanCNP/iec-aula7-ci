// breakingchange.ts
/**
 * Script de teste para gerar commit
 * Apenas para acionar pipeline CI/CD
 */

export function saudacao(nome: string): string {
  return `Olá, ${nome}! Bem-vindo ao mundo TypeScript.`;
}

// Função de teste
function main() {
  const mensagem = saudacao("Cavalheiro");
  console.log(mensagem);
}

main();

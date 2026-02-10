/** Маппинг названий компаний на пути к логотипам (public/company/) */
export const COMPANY_LOGOS: Record<string, string> = {
  'Победа': '/company/pobeda.png',
  'S7 Airlines': '/company/s7.png',
  'Red Wings': '/company/redw.png',
};

export function getCompanyLogo(company: string): string | undefined {
  return COMPANY_LOGOS[company];
}

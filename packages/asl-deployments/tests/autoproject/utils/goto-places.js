export default async function () {
  await this.gotoEstablishment();
  await this.$('a=Approved areas').click();
}

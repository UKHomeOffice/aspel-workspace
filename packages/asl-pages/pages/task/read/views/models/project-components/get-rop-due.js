import { getYear, isBefore } from 'date-fns';
import { ropsYears } from '../../../../../../constants';

export default function getRopDue(project, task) {
  // Draft projects don't need to submit rops
  if (task.data.rops === undefined || !project.issueDate) {
    return '';
  }

  const grantedYear = getYear(project.issueDate);
  const endDate = project.revocationDate ?? project.expiryDate;
  const currentYear = getYear(new Date());
  const thisYearsRopsOverdue = !isBefore(new Date(`${currentYear}-02-01`), new Date());

  return ropsYears
    // Was the project active?
    .filter(year => grantedYear <= year && (endDate ? getYear(endDate) : true))
    // Are rops for the year overdue?
    .filter(year => year < currentYear || (year === currentYear && thisYearsRopsOverdue))
    // Is the rop for this year not submitted
    .filter(year => !task.data.rops.find(ar => ar.year === year))
    .reverse()
    .join(', ')
    // replace last comma with or
    .replace(/,(?=[^,]*$)/, ' or');
}

import $ from 'jquery'; // eslint-disable-line no-unused-vars
import BaseSection from './base';

const selectors = {
  jobs: '#BambooHR-ATS',
  noJobsMessage: '#noJobsOpen'
};

const classes = {
  hide: 'hideNoJobsMessage'
}

export default class FooterSection extends BaseSection {
  constructor(container) {
    super(container, 'jobs-listing');

    const $jobs = $(selectors.jobs);
    if ($jobs.length > 0) {
      $(selectors.noJobsMessage).addClass(classes.hide);
    }
  }
}

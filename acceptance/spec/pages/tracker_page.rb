require 'date'
require_relative '../features/events'
require_relative '../features/skills'
require_relative '../features/msn_assignment'
require_relative './crew_page'

class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers
  require 'date'

  EXPECTED_AVAILABILITY_DAYS = %w(SUN MON TUE WED THU FRI SAT).freeze

  def initialize
    expect(page).to have_content('DMS-MD')
    @all_airmen_count = page.find_all('.airman-name').count
  end

  def assert_navigates_to_dashboard
    click(find('a', text: 'MISSION'))
    expect(page).to have_content('Narwhal')
  end

  def assert_navigates_week
    click(page.find('button.next-week'))
    expect(page).to have_content(get_next_day.strftime('%d %^a'))
    click(page.find('button.last-week'))
    click(page.find('button.last-week'))
    expect(page).to have_content(get_previous_day.strftime('%d %^a'))
  end

  def assert_filters_by_site
    expect(page).to have_content('DMS-MD')
    filter('site', 'DMS-GA')
    expect(page).to have_css('tbody tr', maximum: @all_airmen_count)
  end

  def assert_filters_by_squadron
    filter('site', 'DMS-MD')
    site_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Squadrons')
    filter('squadron', '94 IS')
    expect(page).to have_css('tbody tr', maximum: site_count)
  end

  def assert_filters_by_flight
    filter('site', 'DMS-MD')
    filter('squadron', '94 IS')
    squadron_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Flights')
    filter('flight', 'DOB')
    expect(page).to have_css('tbody tr', maximum: squadron_count)
  end

  def assert_filters_by_last_name
    last_name = "Spaceman"
    fill_in('last-name', with: last_name)
    expect(page).to have_css('.airman-name', count: 1)

    last_name.split("").each do
      page.find('input[name=last-name]').native.send_key(:backspace)
    end

    expect(page).to have_css('.airman-name', minimum: 2)
  end

  def assert_filters_by_shift
    filter('shift', 'Night')
    expect(page).to have_css('.airman-name', maximum: @all_airmen_count - 1)

    filter('shift', 'All')
    expect(page).to have_css('.airman-name', count: @all_airmen_count)
  end

  def assert_filters_by_certification
    typeahead('Filter Certifications', 'SUPER SPEED')
    expect(page).to have_css('.airman-name', maximum: @all_airmen_count - 1)
  end

  def assert_filters_by_qualification
    typeahead('Filter Qualifications', 'QB')
    expect(page).to have_css('.airman-name', maximum: @all_airmen_count - 1)
  end

  def assert_shows_availability
    click_on_airman('Spaceman, Corey')
    page.within('.side-panel') do
      expect(page).to have_content('AVAILABILITY')
      expect(page).to have_content('Spaceman, Corey')
      EXPECTED_AVAILABILITY_DAYS.each { |day_name| expect(page).to have_content(day_name) }
    end
    can_advance_to_next_week
  end

  def assert_shows_currency
    click_on_airman('Spaceman, Corey')
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      expect(page).to have_content('CURRENCY')
      expect(page).to have_content('RIP TASKS')
      expect(page).to have_content('Spaceman, Corey')
      expect(page).to have_content('QB')
      expect(page).to have_content('25 Jan 19')
      expect(page).to have_content('LASER VISION')
      expect(page).to have_content('25 Jan 19')
    end
  end

  def assert_create_update_delete_event
    click_on_airman('Keeter, Tracy')

    event = Event.new

    event.create
    expect(event).to exist

    event.update
    expect(event).to exist

    event.delete
    expect(event).not_to exist
  end

  def assert_create_event_validation
    click_on_airman('Keeter, Tracy')
    event = Event.new

    event.create_invalid
    expect(page.has_content?('This field is required.')).to be true
  end

  def assert_view_update_RIP
    expiration = DateTime.now + 90
    open_rip_page
    page.all('.DateInput_input')[0].set('')
    page.all('.DateInput_input')[0].set(expiration.strftime('%m/%d/%Y'))
    find('input[type="submit"]').click
    open_rip_page
    expect(page.all('.DateInput_input')[0].value).to eq(expiration.strftime('%m/%d/%Y'))
  end

  def assert_delete_create_update_qualification
    click_on_airman('Spaceman, Corey')

    skill = Skill.new

    if skill.qualification_exists?
      skill.delete_qualification
      expect(skill.qualification_exists?).to be false
    end

    skill.create_qualification
    expect(skill.qualification_exists?).to be true

    skill.update_qualification
    expect(skill.qualification_exists?).to be true

    skill.delete_qualification
    expect(skill.qualification_exists?).to be false
  end

  def assert_delete_create_update_certification
    click_on_airman('Spaceman, Corey')

    skill = Skill.new

    if skill.certification_exists?
      skill.delete_certification
      expect(skill.certification_exists?).to be false
    end
    skill.create_certification
    expect(skill.certification_exists?).to be true

    skill.update_certification
    expect(skill.certification_exists?).to be true

    skill.delete_certification
    expect(skill.certification_exists?).to be false
  end

  def assert_create_skill_validation
    click_on_airman('Keeter, Tracy')
    skill = Skill.new

    skill.create_invalid
    expect(page.has_content?('This field is required.')).to be true
  end

  def assert_create_view_and_delete_crew
    click_on_airman('Spaceman, Corey')
    msn_assignment = MsnAssignment.new
    msn_assignment.create

    click_on_airman('Keeter, Tracy')
    msn_assignment = MsnAssignment.new
    msn_assignment.create

    click_on_airman('Spaceman, Corey')
    crew_page = CrewPage.new(msn_assignment.msn_title)
    crew_page.assert_has_assigned_airmen('Spaceman, Corey', 'Keeter, Tracy')

    crew_page.fill_in_position_and_make_critical
    crew_page.add_new_crew_member
    crew_page.delete_crew_member
  end

  def assert_return_to_tracker_with_previous_filter_values
    filter('site', 'DMS-MD')
    filter('squadron', '94 IS')
    squadron_count = page.find_all('.airman-name').count

    filter('flight', 'DOB')
    typeahead('Filter Qualifications', 'QB')
    typeahead('Filter Certifications', 'SUPER SPEED')

    click(find('a', text: 'MISSION'))


    expect(page).to have_css('a.selected', text: 'MISSION')
    click(find('a', text: 'AVAILABILITY'))

    expect(page).to have_css('a.selected', text: 'AVAILABILITY')
    expect(page.find_all('.airman-name').count).to be < squadron_count
    expect(page).to have_select('site-filter', selected: 'DMS-MD')
    expect(page).to have_select('squadron-filter', selected: '94 IS')
    expect(page).to have_select('flight-filter', selected: 'DOB')
    page.within('.qualifications-multitypeahead') do
      expect(page.find('.rbt-token').text).to eq 'QB ×'
    end
    page.within('.certifications-multitypeahead') do
      expect(page.find('.rbt-token').text).to eq 'SUPER SPEED ×'
    end
  end

  private

  def click_on_airman(name)
    fill_in('last-name', with: name.split(',')[0])
    page.first('span', text: name).click
    page.within '.side-panel' do
      expect(page).to have_content name
    end
  end

  def open_rip_page
    click(page.first(".airman-cert", text: "LASER VISION"))
    expect(page).to have_content('RIP TASKS')
    click(page.find("div.rip-item-tile-title", text: "RIP TASKS"))
    expect(page).to have_content('DCGS Mission')
  end

  def filter(item, value)
    page.find("##{item}-filter").find(:option, text: value).select_option
  end

  def typeahead(item, value)
    page.within('.roster-header') do
      fill_in(item, with: value)
      click_link(value)
    end
  end

  def can_advance_to_next_week
    page.within('.side-panel') do
      find('button.next-week').click
      expect(page).to have_content(get_next_day(7).strftime('%d %^b'))
    end
  end

  def get_next_day(amount_of_days = 1)
    Date.today + amount_of_days
  end

  def get_previous_day(amount_of_days = 1)
    Date.today - amount_of_days
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end
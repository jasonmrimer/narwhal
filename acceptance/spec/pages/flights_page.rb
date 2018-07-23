class FlightsPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize
    visit '/flights'
  end

  def assert_shows_airmen
    expandFlightContainer
    expect(page).to have_css('.airman-name', minimum: 1)
  end

  def assert_shows_certifications
    expect(page).to have_css('.certification-row', minimum: 1)
  end

  def assert_shows_airman
    expandFlightContainer
    click_on_airman('Angie, Patton')
    find_typeahead_text('.airman-squadron', '94 IS')
    find_typeahead_text('.airman-site', 'DMS Maryland')
  end

  def assert_edit_airman
    expandFlightContainer

    click_on_airman('Angie, Patton')

    fill_in 'lastName', with: 'Bob'
    fill_in 'firstName', with: 'Sponge'

    typeahead_select('.airman-site', 'DGS 1')
    typeahead_select('.airman-squadron', '30 IS')
    typeahead_select('.airman-flight', 'JKB')
    typeahead_select('.airman-schedule', 'Back Half')
    typeahead_select('.airman-shift', 'Day')
    typeahead_select('.airman-rank', 'SSgt')

    find('input[type="submit"]').click

    expect(page).to have_content 'Bob, Sponge'

    find_typeahead_text('.airman-site', 'DGS 1')
    find_typeahead_text('.airman-squadron', '30 IS')
    find_typeahead_text('.airman-flight', 'JKB')
    find_typeahead_text('.airman-schedule', 'Back Half')
    find_typeahead_text('.airman-shift', 'Day')
    find_typeahead_text('.airman-rank', 'SSgt')

    fill_in 'lastName', with: 'Angie'
    fill_in 'firstName', with: 'Patton'

    typeahead_select('.airman-site', 'DMS Maryland')
    typeahead_select('.airman-squadron', '94 IS')
    typeahead_select('.airman-flight', 'DOB')
    typeahead_select('.airman-schedule', 'No Schedule')
    typeahead_select('.airman-shift', 'Night')
    typeahead_select('.airman-rank', 'No Rank')

    find('input[type="submit"]').click

    expect(page).to have_content 'Angie, Patton'

    find_typeahead_text('.airman-site', 'DMS Maryland')
    find_typeahead_text('.airman-squadron', '94 IS')
    find_typeahead_text('.airman-flight', 'DOB')
    find_typeahead_text('.airman-schedule', 'No Schedule')
    find_typeahead_text('.airman-shift', 'Night')
    find_typeahead_text('.airman-rank', 'No Rank')
  end

  def assert_edit_certification
    click_on_certification('LASER VISION')

    expect(page).to have_content 'LASER VISION'

    fill_in 'Acronym', with: 'Frost Breath'

    find('input[type="submit"]').click

    expect(page).to have_content 'FROST BREATH'

    fill_in 'Acronym', with: 'LASER VISION'

    find('input[type="submit"]').click

    expect(page).to have_content 'LASER VISION'
  end

  def assert_delete_certification
    click_on_certification('INVISIBILITY')

    expect(page).to have_content('INVISIBILITY')

    page.find('.delete').click

    expect(page).to have_content 'Delete INVISIBILITY?'

    click_button 'CONFIRM'

    expect(page).to have_content 'certifications'
  end

  def assert_create_and_delete_airman
    expandFlightContainer

    first('.new-operator-button').click

    fill_in 'lastName', with: 'Aaron'
    fill_in 'firstName', with: 'Aadam'
    typeahead_select('.airman-site', 'DMS Maryland')

    find('input[type="submit"]').click

    visit '/flights'

    expandFlightContainer

    expect(page).to have_content 'Aaron, Aadam'

    click_on_airman 'Aaron, Aadam'

    click_button 'DELETE MEMBER'

    expect(page).to have_content 'This action cannot be undone.'

    page.within('.actions') do
      click_link_or_button 'CONFIRM'
    end
  end

  def assert_create_certification
    visit '/certifications/new'

    fill_in 'title', with: 'SLEEP'

    find('input[type="submit"]').click

    click_link 'Back'

    expect(page).to have_content 'SLEEP'
  end

  private

  def expandFlightContainer
    page.within('#DOB') do
      find('.expandFlight').click
    end
  end

  def click_on_airman(name)
    page.find('.airman-name', text: name).click
    expect(page).to have_content('Personal Information')
  end

  def click_on_certification(name)
    page.find('a', text: name).click
    expect(page).to have_content('Certification')
  end

  def typeahead_select(className, value)
    page.within(className) do
      find('.rbt-input').click
      click_on(value);
    end
  end

  def find_typeahead_text(typeaheadClass, value)
    page.within(typeaheadClass) do
      expect(page.find('.rbt-input-main').value).to eq value
    end
  end
end
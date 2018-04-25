class FlightsPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize
    visit '/flights'
    expect(page).to have_css('.airman-name')
  end

  def assert_shows_airmen
    expect(page).to have_css('.airman-name', minimum: 1)
  end

  def assert_shows_airman_profile
    click_on_airman('Angie, Patton')
    expect(page).to have_content('94 IS')
    expect(page).to have_content('DMS Maryland')
  end

  def assert_edit_airman_profile
    click_on_airman('Angie, Patton')

    fill_in 'lastName', with: 'Bob'
    fill_in 'firstName', with: 'Sponge'

    find('input[type="submit"]').click

    expect(page).to have_content 'Bob, Sponge'

    fill_in 'lastName', with: 'Angie'
    fill_in 'firstName', with: 'Patton'

    find('input[type="submit"]').click

    expect(page).to have_content 'Angie, Patton'
  end

private

def click_on_airman(name)
  page.find('span', text: name).click
  expect(page).to have_content('Personal Information')
end

end
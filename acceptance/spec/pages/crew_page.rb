class CrewPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize(msn_title = "")
    page.within('.side-panel') do
      find('a', text: 'AVAILABILITY').click
      page.within('.event-title', text: msn_title) do
        click(find('a'))
      end
    end
  end

  def assert_has_assigned_airmen(*airmen)
    airmen.each { |airman| expect(page).to have_content(airman) }
  end

  def fill_in_position_and_make_critical
    page.first('input[name="title"]').set 'Chimichanga'
    page.find('label[for="critical-0"]').click
    click_button 'SAVE'

    page.refresh

    expect(page).to have_selector('input[value="Chimichanga"]')
    expect(page.find('#critical-0', visible: false)).to be_checked
  end

  def add_new_crew_member
    fill_in 'airmanName', with: 'Munoz, Diana'
    click_button 'SAVE'

    page.refresh

    expect(page).to have_text 'Munoz, Diana'
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end

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
    page.find('#critical-0', visible: false).set(true)
    click_button 'SAVE'

    page.refresh

    expect(page).to have_selector('input[value="Chimichanga"]')
    expect(page.find('#critical-0', visible: false)).to be_checked
  end

  def add_new_crew_member
    find(:css, ".crew-list .rbt-input-main").set("Munoz, Diana")
    click_link('Munoz, Diana')
    click_button 'SAVE'

    page.refresh

    expect(page).to have_text 'Munoz, Diana'
  end

  def delete_crew_member
    expect(page).to have_selector('.crew-position', count: 3)
    click(page.all('button').last)

    expect(page).to have_selector('.crew-position', count: 2)
    click(page.all('button').last)

    expect(page).to have_selector('.crew-position', count: 1)
    click(page.all('button').last)

    expect(page).to have_selector('.crew-position', count: 0)

    click_button 'SAVE'

    page.refresh

    expect(page.find('.crew-list')).not_to have_text 'Munoz, Diana'
    expect(page.find('.crew-list')).not_to have_text 'Spaceman, Corey'
    expect(page.find('.crew-list')).not_to have_text 'Keeter, Tracy'
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end

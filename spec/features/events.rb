class Event
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :start, :end, :title

  def initialize
    set_attrs
  end

  def create_invalid
    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      find('label', text: 'APPOINTMENT').click
      
      fill_in 'description', with: "invalid event"
      find('input[type="submit"]').click
    end
  end

  def create
    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      find('label', text: 'APPOINTMENT').click

      fill_in 'title', with: @title
      fill_in 'startDate', with: @start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @start.strftime('%H:%M')
      fill_in 'endDate', with: @end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def update
    page.within('.side-panel') do
      scroll_to(page.find('.event-title', text: @title))
      page.find('.event-title', text: @title).click
      expect(find_field('title').value).to eq @title
      expect(find_field('APPOINTMENT', visible: false)).to be_checked

      set_attrs

      fill_in 'title', with: @title
      fill_in 'startDate', with: @start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @start.strftime('%H:%M')
      fill_in 'endDate', with: @end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def delete
    scroll_to(page.find('.event-title', text: @title).find('button.delete'))
    page.find('.event-title', text: @title).find('button.delete').click
    expect(page.has_content?('REMOVE EVENT')).to be true

    page.find('button.cancel', text: 'CANCEL').click
    expect(page.has_content?('REMOVE EVENT')).to be false
    expect(exists?).to be true
    
    page.find('.event-title', text: @title).find('button.delete').click
    expect(page.has_content?('REMOVE EVENT')).to be true
    
    page.find('button.confirm', text: 'REMOVE').click
  end
  
  def exists?
    page.within('.side-panel') do
      page.has_content?('AVAILABILITY') && 
      page.has_content?(@start.strftime('%d %^b %y')) &&
      page.has_content?(@title) &&
      page.has_content?(@start.strftime('%H%MZ') + ' - ' + @end.strftime('%H%MZ'))
    end
  end
  
  private

  def set_attrs
    @start = Time.now.utc
    @end = @start + 3600
    @title = "Test Event #{Time.now}"
  end

  def scroll_to(element)
    script = <<-JS
      arguments[0].scrollIntoView(true);
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end
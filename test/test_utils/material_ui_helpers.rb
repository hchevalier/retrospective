module MaterialUiHelpers
  def material_ui_select(value, from:)
    find(".MuiSelect-select#mui-component-select-#{from}").click
    within "#menu-#{from} ul.MuiMenu-list" do
      find("li[data-value='#{value}']", visible: false).click
    end
  end
end

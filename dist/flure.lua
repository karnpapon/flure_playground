local js = require "js"
local window = js.global
local document = window.document

local drawer = require "drawer"
local vm = require "vm"

local form = document:getElementById('form_submit')
local flure_code = document:getElementById('flure_code')
-- local form_btn = document:getElementById('form_btn')

form.onsubmit = function (e)
  if not flure_code.value then return false end
  vm.build_mode = true
  drawer.init()
  drawer.render(flure_code.value, "output_img")
  return false
end

-- local p = document:createElement("p")
-- document.body:appendChild(p);

-- local data = { 
--     name = "kikou",
--     todos = {"kikou1", "kikou2"}
-- }


-- local _title = document:createElement('h1')
-- _title.innerHTML = data["name"]
-- document.body:appendChild(_title)


-- M.bar()
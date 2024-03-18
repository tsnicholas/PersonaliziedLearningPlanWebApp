import React, { useState, PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emptyUser } from "../types";
import DropDownMenu from "./dropDown/DropDownMenu";
import DropDownItem from "./dropDown/DropDownItem";
import DropDownCheckbox from "./dropDown/DropDownCheckbox";
import { useSettings, useSettingsMutation } from "../hooks/useSettings";
import { IoIosLogOut } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import ProfilePicture from "./ProfilePicture";
import { useLogoutService } from "../features/login/hooks/useAuth";
import { useAuth } from "../context/AuthContext";

const CLICKABLE_ELEMENT_STYLE = "hover:bg-[#820000] cursor-pointer duration-500";

const AccountButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSettings(user.id);
  const { mutate: updateSettings } = useSettingsMutation(user.id);
  const { mutateAsync: logout } = useLogoutService();

  async function handleLogout() {
    await logout();
    navigate("/#");
  }
  
  if(user.id !== emptyUser.id) {
    // Fixed values need to be changed to adjust to smaller screens, but this is fine for now. -Tim
    return (
      <AccountDropDown>
        <DropDownMenu style="absolute top-[58px] w-[190px] translate-x-[-45%] translate-y-[20px]">
          {isLoading && <p>Loading...</p>}
          {error && <p>An error has occurred!</p>}
          {!isLoading && !error && 
            <div>
              <DropDownCheckbox 
                handleCheckToggle={(checked) => updateSettings({allowCoachInvitations: data[0].allow_coach_invitations, receiveEmails: checked})} 
                checked={data[0].receive_emails}
              >
                Receives Email
              </DropDownCheckbox>
              <DropDownCheckbox 
                handleCheckToggle={(checked) => updateSettings({receiveEmails: data[0].receive_emails, allowCoachInvitations: checked})} 
                checked={data[0].allow_coach_invitations}
              >
                Allow Invites
              </DropDownCheckbox>
            </div>
          }
          <DropDownItem leftIcon={<IoIosLogOut className="size-6" />} onClick={handleLogout}>Logout</DropDownItem>
        </DropDownMenu>
      </AccountDropDown>
    );
  } else {
    return (
      <div data-testid="container">
        <Link data-testid="loginLink" to="/login" className="no-underline text-white font-headlineFont">
          <button 
            data-testid="loginButton"
            className={`flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none ${CLICKABLE_ELEMENT_STYLE} px-4`}
          >
            Login/Register
          </button>
        </Link>
      </div>
    );
  }

  function AccountDropDown({children}: PropsWithChildren) {
    return (
      <div>  
        <div className={`flex flex-row ${CLICKABLE_ELEMENT_STYLE} py-[5px] px-[8px] gap-[5px] items-center`} onClick={() => {setOpen(!open)}}>
          <ProfilePicture style="size-14" />
          {open ? <FaCaretUp className="size-5" /> : <FaCaretDown className="size-5" />}
        </div>
        {open && children}
      </div>
    );
  }
}

export default AccountButton;

import React, { useState, useEffect, useRef } from 'react';
import { Fragment } from 'react';
import { Link } from 'react-scroll';
import { useForm } from 'react-hook-form';
import ScrollReveal from 'scrollreveal';
import emailjs from 'emailjs-com';
import ReCAPTCHA from "react-google-recaptcha";
import ReactLoading from 'react-loading';
import { EnvelopeIcon, PhoneIcon, ChevronDownIcon, PencilIcon, DocumentMagnifyingGlassIcon, RocketLaunchIcon, ChevronDoubleUpIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, BellIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, PencilSquareIcon, CodeBracketSquareIcon, DocumentDuplicateIcon, InboxIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { FaGithub } from 'react-icons/fa';
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavMenuItem } from '../Components/Section/NavMenuItem';
import { ScrollTopButton } from '../Components/Common/ScrollTopButton';
import { BlogPost, BlogProfile, SmallTitle } from '../Components/Section/BlogItem';
import { InstagramItem, InstagramProfile } from '../Components/Section/InstagramItem';
import { ActivityItem } from '../Components/Section/ActivityItem';
import { frontend, backend, tools, os, database, server } from '../Components/Section/Skills';
import { SocialIcon } from '../Components/Section/SocialIcon';
import { SliderItem1, SliderItem2, SliderItem3, SliderSetting } from '../Components/Section/SliderItem';
import { MyProfile } from '../Components/Section/ProfileItem';
import { InternshipItem1, InternshipItem2, InternshipProfile } from '../Components/Section/InternItem';
import { ServicesItem1, ServicesItem2, ServicesItem3 } from '../Components/Section/ServiceItem';
import "../CSS/TopPage.css";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

export default function TopPage() {

  const icons: { [key: string]: JSX.Element } = {
    InboxIcon: <InboxIcon className="h-6 w-6 text-white" aria-hidden="true" />,
    CodeBracketSquareIcon: <CodeBracketSquareIcon className="h-6 w-6 text-white" aria-hidden="true" />,
    DocumentDuplicateIcon: <DocumentDuplicateIcon className="h-6 w-6 text-white" aria-hidden="true" />
  };

  //Recaptcha
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const onChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  //ヘッダーコントロール
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerStyle, setHeaderStyle] = useState({
    transform: 'translateY(0)',
    transition: 'transform 0.3s',
  });

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < 120) {
        setHeaderStyle({
          transform: 'translateY(0)',
          transition: 'transform 0.3s',
        });
      } else if (window.scrollY > lastScrollY) {
        setHeaderStyle({
          transform: 'translateY(-100%)', 
          transition: 'transform 0.3s',
        });
      } else {
        setHeaderStyle({
          transform: 'translateY(0)',
          transition: 'transform 0.3s',
        });
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);

      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  const [show, setContactConfirmShow] = useState(false)
  const cancelButtonRef = useRef(null)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  //バリデーション
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  interface FormData {
    sei: string;
    mei: string;
    email: string;
    company: string;
    tel: string;
    message: string;
    honeypot: string;
  }

  //問い合わせ
  const [formData, setContactFormData] = useState<FormData | null>(null);
  const [open, setContactDialogOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    if (!data.honeypot) {
      setContactFormData(data);
      setContactDialogOpen(true);
    } else {
      return
    }
  };

  //メール送信
  const sendEmail = () => {
    if (!formData) return;
    const formDataAsRecord: Record<string, unknown> = {
      sei: formData.sei,
      mei: formData.mei,
      email: formData.email,
      company: formData.company,
      tel: formData.tel,
      message: formData.message,
    };

    emailjs.send(process.env.REACT_APP_CONTACT_SERVICE_ID as string, process.env.REACT_APP_CONTACT_TEMPLATE_ID as string, formDataAsRecord, process.env.REACT_APP_CONTACT_USER_ID as string)
      .then((result) => {
        console.log('送信できた!', result.text);
        setContactConfirmShow(true);
        reset();
      }, (error) => {
        console.log('Failed to send email:', error.text);
        setContactConfirmShow(false);
      }).finally(() => {
        setContactDialogOpen(false);
      });
  };

  const handleConfirmSend = () => {
    sendEmail();
  };
  const handleCancel = () => {
    setContactDialogOpen(false);
  };

  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false);

  //ローディング
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  //星
  interface Skill {
    name: string;
    title: string;
    star: string;
    imageUrl: string;
  }

  const [selectedStar, setSelectedStar] = useState('All');

  const filterSkillsByStars = (skillsArray: Skill[]): Skill[] => {
    if (selectedStar === 'All') {
      return skillsArray;
    }
    return skillsArray.filter((skill: Skill) => skill.star === selectedStar);
  };

  //プライバシー
  useEffect(() => {
    if (!isLoading) {
      setIsPrivacyDialogOpen(true);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="loading-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ReactLoading type="spin" color="white" width={150} height={150} />
        <h1 className='absolute text-xl text-white'>ロード中</h1>
      </div>
    );
  }
  
  return (

  // ナビゲーション

  <div className="bg-gray-800">
    <Disclosure as="nav" className="fixed top-0 w-full z-50 bg-gray-800" style={{...headerStyle, boxShadow: '0 8px 12px -4px rgba(255, 255, 255, 0.1), 0 4px 8px -4px rgba(255, 255, 255, 0.06)'}}>
      {({ open, close }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div>
              <button onClick={scrollToTop} className='flex align-left'>
                {MyProfile.map((item) => (
                <img src={item.headerimageUrl} alt="トップページへ" className='md:w-1/2 lg:w-4/6 ml-2' />
                ))}
              </button>
            </div>
            <div className="flex items-center px-2 lg:px-0">
              <div className="hidden lg:ml-6 lg:block">
                <div className="flex space-x-4">
                  {NavMenuItem.map((item) => (
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={item.duration}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => { scrollToTop(); close(); }}
                  >
                    {item.name}
                  </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex lg:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
          </div>
        </div>

        <Disclosure.Panel as="nav" className="fixed top-16 w-full z-40 bg-gray-800" style={{...headerStyle, boxShadow: '0 8px 12px -4px rgba(255, 255, 255, 0.1), 0 4px 8px -4px rgba(255, 255, 255, 0.06)'}}>
          <div className="space-y-1 px-2 pb-3 pt-1">
            {NavMenuItem.map((item) => (
              <Link
                to={item.to}
                smooth={true}
                duration={item.duration}
                className="block cursor-pointer rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => { scrollToTop(); close(); }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </Disclosure.Panel>
      </>
      )}
    </Disclosure>

    {/* プライバシー */}

    <Transition.Root show={isPrivacyDialogOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsPrivacyDialogOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 text-gray-900">
                      <b>Google Analytics</b>
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        当サイトでは『Google Analytics』を使用し、匿名のトラフィックデータを収集しています。
                        このプロセスにはCookieが使用されますが、個人情報は含まれません。
                        Cookieの使用はブラウザ設定で拒否できます。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => setIsPrivacyDialogOpen(false)}
                  >
                    閉じる
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

  {/* トップに戻る */}
  <ScrollTopButton scrollToTop={scrollToTop} />

  {/* バナー */}

  <div className="mt-14 pt-4 relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
    <div
      className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      aria-hidden="true"
    >
      <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#4f93ff] to-[#0057ff] opacity-30"
        style={{
          clipPath:
            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
        }}
      />
    </div>
    <div
      className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      aria-hidden="true"
    >
      <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#4f93ff] to-[#0057ff] opacity-30"
        style={{
          clipPath:
            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
        }}
      />
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="lg:text-lg leading-6 text-blue-700 blinking-text">
        {MyProfile.map((item) => (
          <strong className="font-semibold">{item.bannerDescription}</strong>
        ))}
      </p>
    </div>
    <div className="flex flex-1 justify-end">
    </div>
  </div>

  {/* トップ */}

  <div className='flex'>
    {MyProfile.map((item) => (
      <img src={item.dinamicimageUrl} alt="description" />
    ))}
  </div>
  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
      <div className="flex">
        <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-40 sm:w-40" src="/images/face.jpg" alt="" />
      </div>
      <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
        <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
          {MyProfile.map((item) => (
            <h1 className="truncate text-3xl font-bold text-white">{item.title}</h1>
          ))}
        </div>
        <div className="mt-5 flex justify-center space-x-10">
          {SocialIcon.Social.map((item) => (
            <a key={item.name} href={item.href} target='blank' className="text-white hover:text-gray-500">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className='mt-10 text-white'>
      {MyProfile.map((item) => (
        <p>
          {item.description}
        </p>
      ))}
    </div>
  </div>

  {/* 趣味 */}

  <div className="py-0 sm:py-0 bg-gray-800">
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-10">
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {SliderItem1.map((item, index) => (
        <div key={index}>
           <Slider {...SliderSetting}>
            {item.images.map((image, index) => (
              <div key={index} className="relative w-full">
                <img src={image} alt="Slide image" loading="lazy" className="aspect-[13/9] w-full bg-gray-100 object-cover sm:aspect-[13/9] lg:aspect-[13/9]" />
              </div>
            ))}
          </Slider>
          <div className="group relative mt-8">
            <h2 className="text-2xl font-semibold leading-6 text-white">{item.title}</h2>
            <p className="mt-5 leading-6 text-white">{item.description}</p>
            <div className="mt-5 flex flex-wrap">
              {item.badges.map((badge, index) => (
                <span key={index} className={`${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      {SliderItem2.map((item, index) => (
        <div key={index}>
          <Slider {...SliderSetting}>
            {item.images.map((image, index) => (
              <div key={index} className="relative w-full">
                <img src={image} alt="Slide image" loading="lazy" className="aspect-[13/9] w-full bg-gray-100 object-cover sm:aspect-[13/9] lg:aspect-[13/9]" />
              </div>
            ))}
          </Slider>
          <div className="group relative mt-8">
            <h2 className="text-2xl font-semibold leading-6 text-white">{item.title}</h2>
            <p className="mt-5 leading-6 text-white">{item.description}</p>
            <div className="mt-5 flex flex-wrap">
              {item.badges.map((badge, index) => (
                <span key={index} className={`${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      {SliderItem3.map((item, index) => (
        <div key={index}>
          <Slider {...SliderSetting}>
            {item.images.map((image, index) => (
              <div key={index} className="relative w-full">
                <img src={image} alt="Slide image" loading="lazy" className="aspect-[13/9] w-full bg-gray-100 object-cover sm:aspect-[13/9] lg:aspect-[13/9]" />
              </div>
            ))}
          </Slider>
          <div className="group relative mt-8">
            <h2 className="text-2xl font-semibold leading-6 text-white">{item.title}</h2>
            <p className="mt-5 leading-6 text-white">{item.description}</p>
            <div className="mt-5 flex flex-wrap">
              {item.badges.map((badge, index) => (
                <span key={index} className={`${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>
      <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
    </div>
  </div>

  {/* 経験 */}

  <div id="Activities" className="bg-gray-800 py-10 sm:py-10 mt-5">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-20 text-center">Activities</h2>
      <div className="mx-auto mt-16 max-w-none lg:mt-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
          {ActivityItem.map((item) => (
            <div className="flex flex-col">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                 {icons[item.icon]}
              </div>
              <div className="font-semibold leading-7 text-white text-2xl">
                {item.title}
              </div>
              <div className="mt-5 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto text-white">{item.description}</p>
              </div>
              <div className="mt-5 flex flex-wrap">
                {item.badges.map((badge, bIndex) => (
                  <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
      </div>
    </div>
  </div>
        
  {/* ブログ */}
        
  <div id="Blog" className="bg-gray-800 py-10 sm:py-10 mt-5">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">Blog</h2>
      <div className="mx-auto mt-16 max-w-none lg:mt-24">
      {BlogProfile.map((item) => (
        <div className="flex items-start space-x-5">
          <div className="flex-shrink-0">
            <div className="relative group overflow-hidden">
              <a href={process.env.REACT_APP_MY_BLOG_URL} target='blank' rel="noopener noreferrer">
                <img
                  className="h-16 w-16 rounded-full transition duration-300 ease-in-out group-hover:opacity-35"
                  src={item.imageUrl}
                  alt=""
                />
              </a>
            </div>
          </div>
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold text-white"><a href={item.url} target='blank' className='hover:text-gray-500'>{item.title}</a></h1>
            <p className="text-sm font-medium text-white">
              {item.description}
            </p>
          </div>
        </div>
        ))}
      </div>
      {SmallTitle.map((item) => (
      <h1 className="mt-10 text-2xl font-bold tracking-tight text-white sm:text-2xl">
        {item.title}
      </h1>
      ))}
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {BlogPost.map((post) => (
        <a href={post.href} target='_brank' key={post.id} className="group flex flex-col items-start justify-between transition duration-300 ease-in-out group-hover:opacity-75">
          <div className="relative w-full">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
              <a href={post.href} target="_blank" rel="noopener noreferrer">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover object-center transition duration-300 ease-in-out group-hover:opacity-75"
                />
              </a>
            </div>
          </div>
          <div className="max-w-xl">
            <div className="mt-8 flex items-center gap-x-4 text-xs">
              <time className="text-white group-hover:text-gray-500">
                {post.date}
              </time>
              <a
                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 group-hover:bg-gray-500"
              >
                {post.category}
              </a>
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-500">
                <a href={post.href} target='blank'>
                  {post.title}
                </a>
              </h3>
              <p className="mt-5 line-clamp-2 text-sm leading-6 text-white group-hover:text-gray-500">{post.description}</p>
            </div>
          </div>
        </a> 
        ))}
      </div>
    <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
    </div>
  </div>

  {/* インターン */}

  <div id="Internship" className="bg-gray-800 py-10 sm:py-10 mt-5">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-20 text-center">Internship</h2>
      <div className="mx-auto mt-16 max-w-none lg:mt-24">
        <div className="mx-auto">
          {InternshipProfile.map((item) => (
            <div className=''>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">
                {item.title}
              </h1>
              <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
                <div>
                  <p>
                    {item.duration}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10 mx-auto">
            {InternshipItem1.map((item) => (
              <article className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="relative aspect-[13/9] sm:aspect-[13/9] lg:w-80 lg:shrink-0 ">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full bg-gray-50 object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div>
                  <div className="">
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">
                      {item.title}
                    </h1>
                    <p className='mb-2 mt-2 text-white'>{item.duration}</p>
                    <div className="flex flex-wrap">
                      {item.badges.map((badge, bIndex) => (
                        <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
                      ))}
                    </div>
                    <p className="mt-3 leading-6 text-white">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 mx-auto">
          {InternshipItem2.map((item) => (
            <article className="relative isolate flex flex-col gap-8 lg:flex-row">
              <div className="relative aspect-[13/9] sm:aspect-[13/9] lg:w-80 lg:shrink-0 ">
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full bg-gray-50 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div>
                <div className="">
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">
                    {item.title}
                  </h1>
                  <p className='mb-2 mt-2 text-white'>{item.duration}</p>
                  <div className="flex flex-wrap">
                    {item.badges.map((badge, bIndex) => (
                      <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
                    ))}
                  </div>
                  <p className="mt-5 leading-6 text-white">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
    </div>
  </div>

  {/* サービス */}

  <div id='Service' className="bg-gray-800 pt-10 sm:pt-10 mt-5">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-20">Services</h2>
    </div>
  </div>

  {ServicesItem1.map((item) => (
  <div className="bg-gray-800 pb-20 sm:pb-10">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">{item.title}</h1>
        <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
          <div>
            <p>
              {item.comment}
            </p>
          </div>
        </div>
        <div className=''>
          <div className="relative overflow-hidden pt-5 lg:pt-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                className="mb-[-1%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                src={item.imageUrl}
                loading="lazy"
                alt="画像"
              />
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-700 pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap">
            {item.badges.map((badge, bIndex) => (
              <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
            ))}
          </div>
          <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
            <div>
              <p>
                {item.description}
              </p>
              <br />
              <p>
                {item.description2}
              </p>
            </div>
          </div>
          <div className="mt-10 flex">
            <a
              target='brank'
              href={item.demoUrl}
              className="inline-flex justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white hover:bg-opacity-40"
            >
              <RocketLaunchIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
              <span>{item.title}</span>
            </a>
            <a
              target='branck'
              href={item.githubUrl}
              className="ml-5 inline-flex justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white hover:bg-opacity-40"
            >
              <FaGithub className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  ))}

  {ServicesItem2.map((item) => (
  <div className="bg-gray-800 py-20 sm:py-10">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">{item.title}</h1>
        <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
          <div>
            <p>
              {item.comment}
            </p>
          </div>
        </div>
        <div className=''>
          <div className="relative overflow-hidden pt-5 lg:pt-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                className="mb-[-1%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                src={item.imageUrl}
                loading="lazy"
                alt="画像"
              />
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-700 pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap">
            {item.badges.map((badge, bIndex) => (
              <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
            ))}
          </div>
          <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
            <div>
              <p>
                {item.description}
              </p>
            </div>
          </div>
          <div className="mt-10 flex">
            <a
              target='branck'
              href={item.githubUrl}
              className="inline-flex justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white hover:bg-opacity-40"
            >
              <FaGithub className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  ))}

  {ServicesItem3.map((item) => (
  <div className="bg-gray-800 py-20 sm:py-10">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-2xl">{item.title}</h1>
        <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
          <div>
            <p>
              {item.comment}
            </p>
          </div>
        </div>
        <div className=''>
          <div className="relative overflow-hidden pt-5 lg:pt-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                className="mb-[-1%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                src={item.imageUrl}
                loading="lazy"
                alt="画像"
              />
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-700 pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap">
            {item.badges.map((badge, bIndex) => (
              <span key={bIndex} className={`mt-1 ${badge.color} text-white font-semibold mr-2 px-2.5 py-0.5 rounded`}>{badge.label}</span>
            ))}
          </div>
          <div className="mt-5 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-white lg:max-w-none lg:grid-cols-1">
            <div>
              <p>
                {item.description}
              </p>
              <br />
              <p>
                {item.description2}
              </p>
            </div>
          </div>
          <div className="mt-10 flex">
            <a
              target='branck'
              href={item.githubUrl}
              className="inline-flex justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white hover:bg-opacity-40"
            >
              <FaGithub className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  ))}

  {/* スキル */}

  <div id="Skills" className="bg-gray-800 py-10 sm:py-10">
    <div className="mx-auto max-w-7xl text-center px-6 lg:px-8">
    <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-20">Skills</h2>
      <div className='lg:flex sm:w-full'>
        <div>
          <div>
            <p className='text-left text-white mt-2'>※ ★★★は使用頻度を表しています</p>
          </div>
          <select value={selectedStar} onChange={(e) => setSelectedStar(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-3 bg-gray-700 text-gray-300 sm:text-sm sm:leading-6">
            <option value="All">全て表示</option>
            <option value="★★★">★★★ 何度も扱っている</option>
            <option value="★★☆">★★☆ たまに扱っている</option>
            <option value="★☆☆">★☆☆ 扱う機会はあまりない</option>
          </select>
        </div>
      </div>
      <div className="">
        <h2 className="mt-6 text-left text-3xl font-bold tracking-tight text-white sm:text-3xl">Frontend</h2>
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-17 pt-6 ">
        {filterSkillsByStars(frontend).length > 0 ? (
          filterSkillsByStars(frontend).map((skill: Skill, index: number) => (
            <li key={index} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-3 bg-gray-700">
                <img className="mx-auto h-20 w-20 flex-shrink-0 rounded-full" src={skill.imageUrl} alt="画像" loading="lazy" />
                <h3 className="mt-2 mb-1 text-sm font-medium text-white text-lg"><b>{skill.name}</b></h3>
                <p className="text-sm text-white text-center">{skill.star}</p>
                <p className="mt-2 text-sm text-white text-left">{skill.title}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 text-white text-left"><b>No data</b></li>
        )}
      </ul>
      <div className="">
        <h2 className="mt-12 text-left text-3xl font-bold tracking-tight text-white sm:text-3xl">Backend</h2>
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-17 pt-6 ">
        {filterSkillsByStars(backend).length > 0 ? (
          filterSkillsByStars(backend).map((skill: Skill, index: number) => (
            <li key={index} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-3 bg-gray-700">
                <img className="mx-auto h-20 w-20 flex-shrink-0 rounded-full" src={skill.imageUrl} alt="画像" loading="lazy" />
                <h3 className="mt-2 mb-1 text-sm font-medium text-white text-lg"><b>{skill.name}</b></h3>
                <p className="text-sm text-white text-center">{skill.star}</p>
                <p className="mt-2 text-sm text-white text-left">{skill.title}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 text-white text-left"><b>No data</b></li>
        )}
      </ul>
      <div className="">
        <h2 className="mt-12 text-left text-3xl font-bold tracking-tight text-white sm:text-3xl">Database</h2>
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-17 pt-6 ">
        {filterSkillsByStars(database).length > 0 ? (
          filterSkillsByStars(database).map((skill: Skill, index: number) => (
            <li key={index} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-3 bg-gray-700">
                <img className="mx-auto h-20 w-20 flex-shrink-0 rounded-full" src={skill.imageUrl} alt="画像" loading="lazy" />
                <h3 className="mt-2 mb-1 text-sm font-medium text-white text-lg"><b>{skill.name}</b></h3>
                <p className="text-sm text-white text-center">{skill.star}</p>
                <p className="mt-2 text-sm text-white text-left">{skill.title}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 text-white text-left"><b>No data</b></li>
        )}
      </ul>
      <div className="">
        <h2 className="mt-12 text-left text-3xl font-bold tracking-tight text-white sm:text-3xl">Cloud</h2>
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-17 pt-6 ">
        {filterSkillsByStars(server).length > 0 ? (
          filterSkillsByStars(server).map((skill: Skill, index: number) => (
            <li key={index} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-3 bg-gray-700">
                <img className="mx-auto h-20 w-20 flex-shrink-0 rounded-full" src={skill.imageUrl} alt="画像" loading="lazy" />
                <h3 className="mt-2 mb-1 text-sm font-medium text-white text-lg"><b>{skill.name}</b></h3>
                <p className="text-sm text-white text-center">{skill.star}</p>
                <p className="mt-2 text-sm text-white text-left">{skill.title}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 text-white text-left"><b>No data</b></li>
        )}
      </ul>
      <div className="">
        <h2 className="mt-12 text-left text-3xl font-bold tracking-tight text-white sm:text-3xl">Tools</h2>
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-17 pt-6 ">
        {filterSkillsByStars(tools).length > 0 ? (
          filterSkillsByStars(tools).map((skill: Skill, index: number) => (
            <li key={index} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
              <div className="flex flex-1 flex-col p-3 bg-gray-700">
                <img className="mx-auto h-20 w-20 flex-shrink-0 rounded-full" src={skill.imageUrl} alt="画像" loading="lazy" />
                <h3 className="mt-2 mb-1 text-sm font-medium text-white text-lg"><b>{skill.name}</b></h3>
                <p className="text-sm text-white text-center">{skill.star}</p>
                <p className="mt-2 text-sm text-white text-left">{skill.title}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="col-span-1 text-white text-left"><b>No data</b></li>
        )}
      </ul>
      <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
    </div>
  </div>

  {/* Instagram */}

  <div id="Instagram" className="bg-gray-800 py-10 sm:py-10 mt-5">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">Instagram</h2>
      <div className="mx-auto mt-16 max-w-none lg:mt-24">
        {InstagramProfile.map((item) => (
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0">
              <div className="relative group overflow-hidden">
                <a href={item.url} target='blank' rel="noopener noreferrer">
                  <img
                    className="h-16 w-16 rounded-full transition duration-300 ease-in-out group-hover:opacity-35"
                    src={item.imageUrl}
                    alt=""
                  />
                  <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="pt-1.5">
              <h1 className="text-2xl font-bold text-white"><a href='https://www.instagram.com/ao_realstudent/' target='blank' className='hover:text-gray-500'>{item.title}</a></h1>
              <p className="text-sm font-medium text-white">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-8">
        <div className="relative -mb-6 w-full overflow-x-auto pb-6">
          <ul
            role="list"
            className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:space-x-0"
          >
            {InstagramItem.map((item) => (
              <li key={item.id} className="inline-flex w-64 flex-col text-center lg:w-auto">
                <div className="group relative mt-7">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    <hr className="border-b border-8 border-dashed border-gray-700 mt-20" />
    </div>
  </div>

  {/* 問い合わせ */}

  <div id="Contact" className="relative isolate bg-gray-800 py-10 sm:py-10">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-20">Contact</h2>
    </div>
    <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div className="relative px-6 lg:px-8 py-0 sm:py-10 ">
        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
          <p className="mt-6 text-lg leading-8 text-white">
            何かご質問があれば、こちらからお問い合わせください。即時対応します。
          </p>
          <div className="mt-10 space-y-4 text-base leading-7 text-gray-300">
            <div className="flex gap-x-4">
              <div className="flex-none">
                <span className="sr-only">Email</span>
                <EnvelopeIcon className="h-7 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <a className="hover:text-white text-white" href={`mailto:${process.env.REACT_APP_MY_EMAIL_ADDRESS}`}>
                  {process.env.REACT_APP_MY_EMAIL_ADDRESS}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form  onSubmit={handleSubmit(onSubmit)} method="POST" className="px-6 pt-20 lg:px-8  py-0 sm:py-10 ">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-white">
              氏名
            </label>
            <div className="mt-2.5">
              <input
                placeholder='東洋 太郎'
                {...register("sei", { required: "※ 氏名を入力してください" })}
                type="text"
                name="sei"
                id="sei"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-3 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
              />
              {errors.sei && <p className="text-red-500">{errors.sei.message}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-white">
              題名
            </label>
            <div className="mt-2.5">
              <input
                placeholder='タイトル'
                {...register("mei", { required: "※ 題名を入力してください" })}
                type="text"
                name="mei"
                id="mei"
                autoComplete="family-name"
                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-3 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
              />
              {errors.mei && <p className="text-red-500">{errors.mei.message}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white">
              メールアドレス
            </label>
            <div className="mt-2.5">
              <input
                placeholder='example@example.com'
                {...register("email", { 
                  required: "※ メールアドレスを入力してください",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "※ 有効なメールアドレスを入力してください"
                  }
                })}
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-3 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white">
              内容
            </label>
            <div className="mt-2.5">
              <textarea
                placeholder='お問い合わせです。'
                {...register("message", { required: "※ 内容を入力してください" })}
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-3 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                defaultValue={''}
              />
              {errors.message && <p className="text-red-500">{errors.message.message}</p>}
            </div>
          </div>
        </div>
        {/* スパム */}
        <ReCAPTCHA
          sitekey="6LcslaspAAAAAA15eqFJy4_vL856A7uu4ANjeqId"
          onChange={onChange}
          className='mt-3'
        />
        {/* ハニーポット */}
        <input
          type="text"
          className='honeypot'
          autoComplete="OFF"
          {...register("honeypot")}
          style={{ display: 'none' }}
        />
        <div className="mt-3">
          <button
            type="submit"
            disabled={!captchaValue}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* 送信確認モーダル */}

  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setContactDialogOpen}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                  <EnvelopeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    お問い合わせを送信しますか？
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      お問い合わせの内容は、ポートフォリオの作成者に共有されます。
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleCancel}
                  ref={cancelButtonRef}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                  onClick={handleConfirmSend}
                >
                  送信
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>

  {/* 送信完了アラート */}

  <>
    <div
      style={{ 
        top: headerStyle.transform === 'translateY(0)' ? '3rem' : '-1rem',
        transition: 'top 0.3s',
      }}
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">お問い合わせありがとうございます</p>
                  <p className="mt-1 text-sm text-gray-500">数日以内にご連絡いたしますので、しばらくお待ちください。</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setContactConfirmShow(false)
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </>

  {/* フッター */}
    
  <footer className="bg-gray-800 z-50 mt-20" style={{ boxShadow: '0 -8px 12px -4px rgba(255, 255, 255, 0.1), 0 -8px 12px -4px rgba(255, 255, 255, 0.06)' }}>
    <div className="pt-10 mx-auto max-w-7xl overflow-hidden px-6 py-5 sm:py-10 lg:px-8">
      <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
        {NavMenuItem.map((item) => (
          <div className="pb-6 text-center">
            <Link
              to={item.to}
              smooth={true}
              duration={item.duration}
              className="cursor-pointer text-sm leading-6 text-white hover:text-gray-500"
              onClick={() => { scrollToTop(); }}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </nav>
      <div className="mt-10 flex justify-center space-x-10">
        {SocialIcon.Social.map((item) => (
          <a key={item.name} href={item.href} target='blank' className="text-white hover:text-gray-500">
            <span className="sr-only">{item.name}</span>
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="mt-10 text-center text-xs leading-5 text-white">
        Copyright © 2024 リアルポートフォリオ All Rights Reserved.
      </p>
    </div>
  </footer>
</div>
  )
}

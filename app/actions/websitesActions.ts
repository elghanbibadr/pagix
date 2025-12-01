/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"


import { createClient } from "@/utils/supabase/server";
import { getUser } from "./actions";
import { WeekNumber } from "react-day-picker";


export async function getUserWebsites() {
    try {
    const supabase =await  createClient();
const user=await getUser()
     
    // Generate domain from project name

    const {data:website,error}=await supabase
    .from('websites')
    .select('*')
      .eq('user_id', user.user.id)



      console.log('web--',website, user.user.id,error)
    return {
      success: true,
      data: website,
    };
  } catch (error: any) {
    console.error('Error getting user websites:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch websites ',
    };
  }
}


// const userId=user.user

export async function createWebsite(data: {
  name: string;
  description: string;
}) {

    console.log("data",data)
  try {
    const supabase =await  createClient();
const user=await getUser()
     
    // Generate domain from project name
    const domain = data.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 63); // DNS domain max length

    // Check if domain already exists
    const { data: existingWebsite } = await supabase
      .from('websites')
      .select('id')
      .eq('domain', domain)
      .single();

    // if (existingWebsite) {
    //   // If domain exists, append random string
    //   const randomSuffix = Math.random().toString(36).substring(2, 6);
    //   const uniquedomain = `${domain}-${randomSuffix}`;

    //   const { data: website, error } = await supabase
    //     .from('websites')
    //     .insert({
    //       user_id: data.userId,
    //       name: data.name,
    //       domain: uniquedomain,
    //       description: data.description || null,
    //     })
    //     .select()
    //     .single();

    //   if (error) throw error;

    //   // Create default home page
    //   await supabase.from('pages').insert({
    //     website_id: website.id,
    //     name: 'Home',
    //     slug: 'home',
    //     content: {},
    //     is_home_page: true,
    //     order_index: 0,
    //   });

    //   return { success: true, data: website };
    // }

    // Create website with original domain
    const { data: website, error } = await supabase
      .from('websites')
      .insert({
        user_id: user.user.id,
        name: data.name,
        domain: domain,
        description: data.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Create default home page
    await supabase.from('pages').insert({
      website_id: website.id,
      name: 'Home',
      slug: 'home',
      content: '',
      is_home_page: true,
      order_index: 0,
    });


    return {
      success: true,
      data: website,
    };
  } catch (error: any) {
    console.error('Error creating website:', error);
    return {
      success: false,
      error: error.message || 'Failed to create website',
    };
  }
}


export async function loadWebsite(websiteId: string) {
  try {
    const supabase = await createClient();

    // Get website
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();

      console.log('website id',websiteId)
    if (websiteError) throw websiteError;

    // Get pages
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_id', websiteId)
      .order('order_index', { ascending: true });

    if (pagesError) throw pagesError;

    return {
      success: true,
      data: { website, pages: pages || [] },
    };
  } catch (error: any) {
    console.error('Error loading website:', error);
    return {
      success: false,
      error: error.message || 'Failed to load website',
    };
  }
}



const savePageContent = async (id: string, content: JSON) => {
  const supabase = await createClient();

    try {
      const { error } = await supabase
        .from('pages')
        .update({ content })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Page content saved to database:', id);
    } catch (error) {
      console.error('Error saving page content:', error);
      throw error;
    }
  }


// ADD NEW PAGE
export const addPageAction = async (
  name: string, 
  websiteId: string, 
  slug: string, 
  content: any = ""
) => {
  const supabase = await createClient();

  console.log('📄 addPageAction called with:', { 
    name, 
    slug, 
    contentType: typeof content,
    contentLength: typeof content === 'string' ? content.length : 'N/A',
    isEmpty: content === "",
    contentPreview: typeof content === 'string' ? content.substring(0, 150) : JSON.stringify(content).substring(0, 150)
  });

  try {
    const { data, error } = await supabase
      .from('pages')
      .insert({
        website_id: websiteId,
        name,
        slug: slug,
        content: content,
        is_home_page: false,
        is_published: false,
        order_index: 0,
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Page created in database:', {
      id: data.id,
      name: data.name,
      contentType: typeof data.content,
      contentLength: typeof data.content === 'string' ? data.content.length : 'N/A',
      contentPreview: typeof data.content === 'string' ? data.content.substring(0, 150) : JSON.stringify(data.content).substring(0, 150)
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Error adding page:', error);
    throw error;
  }
};

  // ============= GET PAGES FOR A WEBSITE =============

export async function getPagesByWebsiteId(
  websiteId: string
) {
  try {
    const supabase =await  createClient();

 

    console.log('website id',websiteId)
    


    // Get all pages for this website
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('website_id', websiteId)
      .order('order_index', { ascending: true });

      console.log('pages error',pagesError)

    if (pagesError) throw pagesError;

    console.log('✅ Retrieved pages:', pages?.length || 0);

    return {
      success: true,
      data: pages || [],
    };
  } catch (error: any) {
    console.error('Error getting pages:', error);
    return {
      success: false,
      error: error.message || 'Failed to get pages',
    };
  }
}

// app/actions/pagesActions.ts


// Update page content
export const updatePageContentAction = async (pageId: string, content: any) => {
  console.log('page id',pageId)
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        content: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Page content updated:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error updating page content:', error);
    throw error;
  }
};

// Update page metadata (name, slug, meta tags, etc.)
export const updatePageMeta = async (
  pageId: string, 
  updates: {
    name?: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
    is_home_page?: boolean;
  }
) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Page metadata updated:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error updating page metadata:', error);
    throw error;
  }
};

// Delete page
export const deletePage = async (pageId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;

    console.log('✅ Page deleted:', pageId);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error deleting page:', error);
    throw error;
  }
};